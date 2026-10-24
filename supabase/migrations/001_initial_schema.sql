-- 1. Custom ENUM types
CREATE TYPE public.user_role AS ENUM ('customer', 'admin');
CREATE TYPE public.origin_type AS ENUM ('IMPORT', 'IN_HOUSE');
CREATE TYPE public.shirt_size AS ENUM ('S', 'M', 'L', 'XL', 'XXL');
CREATE TYPE public.order_status AS ENUM ('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'CANCELLED');

-- 2. Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Tables
-- profiles
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name text,
    phone text,
    role public.user_role DEFAULT 'customer',
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- addresses
CREATE TABLE public.addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_name text NOT NULL,
    phone text NOT NULL,
    street text NOT NULL,
    subdistrict_id text,
    subdistrict_name text,
    city_name text NOT NULL,
    province_name text,
    postal_code text NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- categories
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- genres
CREATE TABLE public.genres (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- products
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    category_id uuid REFERENCES public.categories(id),
    genre_id uuid REFERENCES public.genres(id),
    origin_type public.origin_type NOT NULL DEFAULT 'IN_HOUSE',
    base_price bigint NOT NULL,
    weight_grams integer NOT NULL DEFAULT 220,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- product_variants
CREATE TABLE public.product_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    size public.shirt_size NOT NULL,
    sku text UNIQUE,
    stock_quantity integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    UNIQUE(product_id, size)
);

-- product_images
CREATE TABLE public.product_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    is_primary boolean DEFAULT false,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- orders
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    order_number text UNIQUE,
    total_amount bigint NOT NULL,
    shipping_cost bigint NOT NULL DEFAULT 0,
    shipping_courier text,
    shipping_service text,
    tracking_number text,
    status public.order_status DEFAULT 'PENDING_PAYMENT',
    payment_token text,
    midtrans_order_id text UNIQUE,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- order_items
CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id uuid REFERENCES public.product_variants(id),
    product_title text NOT NULL,
    product_size public.shirt_size NOT NULL,
    price_at_purchase bigint NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    created_at timestamptz DEFAULT now()
);

-- 4. Indexes
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_genre_id ON public.products(genre_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_origin_type ON public.products(origin_type);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_midtrans_order_id ON public.orders(midtrans_order_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);

-- 5. Triggers
-- handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ language plpgsql security definer;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- updated_at triggers
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 6. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 7. Seed data
INSERT INTO public.genres (name, slug) VALUES 
('Metal', 'metal'), ('Punk', 'punk'), ('Grunge', 'grunge'), ('Classic Rock', 'classic-rock');

INSERT INTO public.categories (name, slug) VALUES 
('T-Shirts', 't-shirts'), ('Hoodies', 'hoodies'), ('Accessories', 'accessories');

-- 8. Storage Policy Note
-- To manage the 'product-media' bucket, use the following policies in Supabase console:
-- 1. Create a bucket named 'product-media' (public: true)
-- 2. Policy for 'Public Read': 
--    ALLOW SELECT ON storage.objects USING (bucket_id = 'product-media')
-- 3. Policy for 'Authenticated Admin Upload':
--    ALLOW INSERT, UPDATE, DELETE ON storage.objects 
--    USING (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
