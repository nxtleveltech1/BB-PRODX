// Central export point for all database schemas
// This file aggregates all table definitions and relations

import type { User, UserSession } from './user';
import type { Order, OrderItem } from './order';
import type {
  Product,
  Category,
  Subcategory,
  ProductBenefit,
  ProductIngredient,
  ProductTag,
  ProductSize,
} from './product';
import type { ProductImage } from './product-images';
import type { Review } from './review';
import type { CartItem, WishlistItem } from './cart';

// User schemas
export {
  users,
  userSessions,
  usersRelations,
  userSessionsRelations,
  type User,
  type NewUser,
  type UserSession,
  type NewUserSession,
} from './user';

// NextAuth schemas
export {
  accounts,
  sessions,
  verificationTokens,
  type Account,
  type NewAccount,
  type Session,
  type NewSession,
  type VerificationToken,
  type NewVerificationToken,
} from './auth';

// Product schemas
export {
  categories,
  subcategories,
  products,
  productBenefits,
  productIngredients,
  productTags,
  productSizes,
  categoriesRelations,
  subcategoriesRelations,
  productsRelations,
  productBenefitsRelations,
  productIngredientsRelations,
  productTagsRelations,
  productSizesRelations,
  type Category,
  type NewCategory,
  type Subcategory,
  type NewSubcategory,
  type Product,
  type NewProduct,
  type ProductBenefit,
  type NewProductBenefit,
  type ProductIngredient,
  type NewProductIngredient,
  type ProductTag,
  type NewProductTag,
  type ProductSize,
  type NewProductSize,
} from './product';

// Product Images schemas
export {
  productImages,
  productImagesRelations,
  type ProductImage,
  type NewProductImage,
} from './product-images';

// Order schemas
export {
  orders,
  orderItems,
  ordersRelations,
  orderItemsRelations,
  generateOrderNumber,
  type Order,
  type NewOrder,
  type OrderItem,
  type NewOrderItem,
  type Address,
  type ProductSnapshot,
} from './order';

// Cart schemas
export {
  cart,
  wishlist,
  cartRelations,
  wishlistRelations,
  type CartItem,
  type NewCartItem,
  type WishlistItem,
  type NewWishlistItem,
  type CartWithProduct,
  type WishlistWithProduct,
} from './cart';

// Review schemas
export {
  reviews,
  reviewVotes,
  reviewsRelations,
  reviewVotesRelations,
  type Review,
  type NewReview,
  type ReviewVote,
  type NewReviewVote,
  type ReviewWithUser,
  type ReviewStats,
} from './review';

// Social media schemas
export {
  instagramPosts,
  type InstagramPost,
  type NewInstagramPost,
} from './social';

// Common query result types
export interface ProductWithDetails extends Product {
  category?: Category | null;
  subcategory?: Subcategory | null;
  benefits?: ProductBenefit[];
  ingredients?: ProductIngredient[];
  tags?: ProductTag[];
  sizes?: ProductSize[];
  images?: ProductImage[];
  reviews?: Review[];
}

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product: Product;
  })[];
  user: User;
}

export interface UserWithProfile extends User {
  sessions?: UserSession[];
  orders?: Order[];
  cartItems?: CartItem[];
  wishlistItems?: WishlistItem[];
  reviews?: Review[];
}