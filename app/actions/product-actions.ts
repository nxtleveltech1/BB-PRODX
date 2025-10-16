"use server"

import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import {
  revalidateProductCache,
  revalidateProductById,
  revalidateProductPage,
  revalidateHomePage
} from "@/lib/cache"
import { logError, addBreadcrumb } from "@/lib/error-logger"
import { revalidatePath } from "next/cache"

interface ProductInput {
  name: string
  description?: string
  price: string | number
  category?: string
  imageUrl?: string
  stock?: number
}

interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export const createProduct = async (
  input: ProductInput
): Promise<ActionResponse> => {
  try {
    addBreadcrumb("Creating product", "action", "info", {
      productName: input.name,
    })

    const newProduct = await db
      .insert(products)
      .values({
        name: input.name,
        description: input.description,
        price: typeof input.price === "string" ? input.price : String(input.price),
        category: input.category,
        imageUrl: input.imageUrl,
        stock: input.stock || 0,
      })
      .returning()

    // Invalidate relevant caches
    revalidateProductCache()
    revalidateHomePage()

    return {
      success: true,
      data: newProduct[0],
    }
  } catch (error) {
    logError(error, {
      endpoint: "createProduct",
      severity: "error",
      extra: { input },
    })

    return {
      success: false,
      error: "Failed to create product",
    }
  }
}

export const updateProduct = async (
  productId: string,
  input: Partial<ProductInput>
): Promise<ActionResponse> => {
  try {
    addBreadcrumb("Updating product", "action", "info", {
      productId,
    })

    const updated = await db
      .update(products)
      .set({
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.price !== undefined && {
          price: typeof input.price === "string" ? input.price : String(input.price)
        }),
        ...(input.category && { category: input.category }),
        ...(input.imageUrl && { imageUrl: input.imageUrl }),
        ...(input.stock !== undefined && { stock: input.stock }),
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning()

    if (!updated[0]) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    // Invalidate specific product cache
    revalidateProductById(productId)
    revalidateProductPage(productId)

    return {
      success: true,
      data: updated[0],
    }
  } catch (error) {
    logError(error, {
      endpoint: "updateProduct",
      severity: "error",
      extra: { productId, input },
    })

    return {
      success: false,
      error: "Failed to update product",
    }
  }
}

export const deleteProduct = async (
  productId: string
): Promise<ActionResponse> => {
  try {
    addBreadcrumb("Deleting product", "action", "info", {
      productId,
    })

    const deleted = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning()

    if (!deleted[0]) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    // Invalidate all product-related caches
    revalidateProductCache()
    revalidatePath("/products", "layout")
    revalidateHomePage()

    return {
      success: true,
      data: { id: productId },
    }
  } catch (error) {
    logError(error, {
      endpoint: "deleteProduct",
      severity: "error",
      extra: { productId },
    })

    return {
      success: false,
      error: "Failed to delete product",
    }
  }
}

export const updateProductStock = async (
  productId: string,
  quantity: number
): Promise<ActionResponse> => {
  try {
    addBreadcrumb("Updating product stock", "action", "info", {
      productId,
      quantity,
    })

    // Get current stock
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    const newStock = (product.stock || 0) + quantity

    if (newStock < 0) {
      return {
        success: false,
        error: "Insufficient stock",
      }
    }

    const updated = await db
      .update(products)
      .set({
        stock: newStock,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning()

    // Invalidate product cache
    revalidateProductById(productId)

    return {
      success: true,
      data: updated[0],
    }
  } catch (error) {
    logError(error, {
      endpoint: "updateProductStock",
      severity: "error",
      extra: { productId, quantity },
    })

    return {
      success: false,
      error: "Failed to update stock",
    }
  }
}

export const bulkUpdatePrices = async (
  updates: Array<{ id: string; price: string | number }>
): Promise<ActionResponse> => {
  try {
    addBreadcrumb("Bulk updating prices", "action", "info", {
      count: updates.length,
    })

    const results = await Promise.all(
      updates.map(({ id, price }) =>
        db
          .update(products)
          .set({
            price: typeof price === "string" ? price : String(price),
            updatedAt: new Date(),
          })
          .where(eq(products.id, id))
          .returning()
      )
    )

    // Invalidate all product caches
    revalidateProductCache()
    updates.forEach(({ id }) => revalidateProductById(id))
    revalidatePath("/products", "layout")

    return {
      success: true,
      data: {
        updated: results.length,
        products: results.flat(),
      },
    }
  } catch (error) {
    logError(error, {
      endpoint: "bulkUpdatePrices",
      severity: "error",
      extra: { updateCount: updates.length },
    })

    return {
      success: false,
      error: "Failed to update prices",
    }
  }
}