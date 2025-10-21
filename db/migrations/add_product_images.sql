-- Add product_images table for additional product images
-- Migration: add_product_images
-- Created: 2025-01-22

-- Create product_images table
CREATE TABLE IF NOT EXISTS "product_images" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "image_url" VARCHAR(500) NOT NULL,
  "display_order" INTEGER DEFAULT 0 NOT NULL,
  CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
);

-- Create indexes for product_images
CREATE INDEX IF NOT EXISTS "product_images_product_id_idx" ON "product_images" ("product_id");
CREATE INDEX IF NOT EXISTS "product_images_display_order_idx" ON "product_images" ("display_order");

-- Add comment
COMMENT ON TABLE "product_images" IS 'Stores additional product images beyond the main imageUrl for product galleries';
