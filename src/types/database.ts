// ─────────────────────────────────────────────────────────────────────────────
// Database Types — generated from 001_initial_schema.sql
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin';

export type OriginType = 'IMPORT' | 'IN_HOUSE';

export type ShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'CANCELLED';

// ── Row types (what you get back from the DB) ─────────────────────────────────

export interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AddressRow {
  id: string;
  user_id: string | null;
  receiver_name: string;
  phone: string;
  street: string;
  subdistrict_id: string | null;
  subdistrict_name: string | null;
  city_name: string;
  province_name: string | null;
  postal_code: string;
  is_primary: boolean;
  created_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface GenreRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProductRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  genre_id: string | null;
  origin_type: OriginType;
  base_price: number;
  weight_grams: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariantRow {
  id: string;
  product_id: string | null;
  size: ShirtSize;
  sku: string | null;
  stock_quantity: number;
  created_at: string;
}

export interface ProductImageRow {
  id: string;
  product_id: string | null;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface OrderRow {
  id: string;
  user_id: string | null;
  order_number: string | null;
  total_amount: number;
  shipping_cost: number;
  shipping_courier: string | null;
  shipping_service: string | null;
  tracking_number: string | null;
  status: OrderStatus;
  payment_token: string | null;
  midtrans_order_id: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string | null;
  variant_id: string | null;
  product_title: string;
  product_size: ShirtSize;
  price_at_purchase: number;
  quantity: number;
  created_at: string;
}

export type User = ProfileRow;
export type Product = ProductRow;
export type Order = OrderRow;
export type OrderItem = OrderItemRow;
export type ProductVariant = ProductVariantRow;
export type ProductImage = ProductImageRow;
export type Category = CategoryRow;
export type Genre = GenreRow;
export type Address = AddressRow;

export type ProfileInsert = Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>> & { id: string };
export type AddressInsert = Omit<AddressRow, 'id' | 'created_at'> & { id?: string };
export type CategoryInsert = Omit<CategoryRow, 'id' | 'created_at'> & { id?: string };
export type GenreInsert = Omit<GenreRow, 'id' | 'created_at'> & { id?: string };
export type ProductInsert = {
  id?: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  genre_id: string | null;
  origin_type: OriginType;
  base_price: number;
  weight_grams: number;
  is_active: boolean | null;
  created_at?: string;
  updated_at?: string;
};
export type ProductVariantInsert = {
  id?: string;
  product_id: string | null;
  size: ShirtSize;
  sku: string | null;
  stock_quantity: number;
  created_at?: string;
};
export type ProductImageInsert = Omit<ProductImageRow, 'id' | 'created_at'> & { id?: string };
export type OrderInsert = Omit<OrderRow, 'id' | 'created_at' | 'updated_at'> & { id?: string };
export type OrderItemInsert = Omit<OrderItemRow, 'id' | 'created_at'> & { id?: string };

// ── Update types ──────────────────────────────────────────────────────────────

export type ProfileUpdate = Partial<Omit<ProfileRow, 'id' | 'created_at'>>;
export type AddressUpdate = Partial<Omit<AddressRow, 'id' | 'created_at'>>;
export type ProductUpdate = Partial<Omit<ProductRow, 'id' | 'created_at'>>;
export type OrderUpdate = Partial<Omit<OrderRow, 'id' | 'created_at'>>;

// ── Supabase Database type (used with createClient<Database>) ─────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      addresses: {
        Row: AddressRow;
        Insert: AddressInsert;
        Update: AddressUpdate;
        Relationships: [
          {
            foreignKeyName: 'addresses_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: Partial<Omit<CategoryRow, 'id' | 'created_at'>>;
        Relationships: [];
      };
      genres: {
        Row: GenreRow;
        Insert: GenreInsert;
        Update: Partial<Omit<GenreRow, 'id' | 'created_at'>>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_genre_id_fkey';
            columns: ['genre_id'];
            referencedRelation: 'genres';
            referencedColumns: ['id'];
          }
        ];
      };
      product_variants: {
        Row: ProductVariantRow;
        Insert: ProductVariantInsert;
        Update: Partial<Omit<ProductVariantRow, 'id' | 'created_at'>>;
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      product_images: {
        Row: ProductImageRow;
        Insert: ProductImageInsert;
        Update: Partial<Omit<ProductImageRow, 'id' | 'created_at'>>;
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: OrderItemInsert;
        Update: Partial<Omit<OrderItemRow, 'id' | 'created_at'>>;
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_variant_id_fkey';
            columns: ['variant_id'];
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      origin_type: OriginType;
      shirt_size: ShirtSize;
      order_status: OrderStatus;
    };
  };
}

// ── Convenience joined types ───────────────────────────────────────────────────

export interface ProductWithRelations extends ProductRow {
  category: CategoryRow | null;
  genre: GenreRow | null;
  product_variants: ProductVariantRow[];
  product_images: ProductImageRow[];
}

export interface OrderWithItems extends OrderRow {
  order_items: OrderItemRow[];
}
