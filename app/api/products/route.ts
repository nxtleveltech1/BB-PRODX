import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { logError, getRequestId, addBreadcrumb } from "@/lib/error-logger"
import { getCachedProducts } from "@/lib/cache"
import { desc, eq, and, gte, lte, like } from "drizzle-orm"

export async function GET(request: NextRequest) {
  const requestId = await getRequestId()

  try {
    addBreadcrumb("Fetching products", "api", "info", {
      endpoint: "/api/products",
      method: "GET",
    })

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || undefined
    const search = searchParams.get("search") || undefined
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    // Use cached function for basic queries
    if (!search && !minPrice && !maxPrice && page === 1 && limit === 10) {
      const cached = await getCachedProducts({ limit, offset: 0, category })
      return NextResponse.json({
        success: true,
        data: cached.products,
        pagination: {
          page,
          limit,
          total: cached.total,
        },
      })
    }

    // Build query conditions
    const conditions = []
    if (category) {
      conditions.push(eq(products.category, category))
    }
    if (search) {
      conditions.push(like(products.name, `%${search}%`))
    }
    if (minPrice) {
      conditions.push(gte(products.price, minPrice))
    }
    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice))
    }

    // Fetch from database with conditions
    const offset = (page - 1) * limit
    const query = db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset)

    if (conditions.length > 0) {
      const result = await query.where(and(...conditions))
      return NextResponse.json({
        success: true,
        data: result,
        pagination: {
          page,
          limit,
          total: result.length,
        },
      })
    }

    const result = await query
    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total: result.length,
      },
    })
  } catch (error) {
    logError(error, {
      requestId,
      endpoint: "/api/products",
      severity: "error",
      tags: {
        method: "GET",
      },
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        requestId,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const requestId = await getRequestId()

  try {
    addBreadcrumb("Creating product", "api", "info", {
      endpoint: "/api/products",
      method: "POST",
    })

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and price are required",
        },
        { status: 400 }
      )
    }

    // Insert product
    const newProduct = await db.insert(products).values({
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      imageUrl: body.imageUrl,
      stock: body.stock || 0,
    }).returning()

    addBreadcrumb("Product created", "api", "info", {
      productId: newProduct[0].id,
    })

    return NextResponse.json({
      success: true,
      data: newProduct[0],
    }, { status: 201 })
  } catch (error) {
    logError(error, {
      requestId,
      endpoint: "/api/products",
      severity: "error",
      tags: {
        method: "POST",
      },
    })

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
        requestId,
      },
      { status: 500 }
    )
  }
}