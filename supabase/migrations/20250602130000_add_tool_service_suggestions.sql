-- Add suggestion fields to tools table
ALTER TABLE public.tools
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS suggested_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS suggested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add suggestion fields to services table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS suggested_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS suggested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create function to handle new tool suggestions
CREATE OR REPLACE FUNCTION public.handle_new_tool_suggestion()
RETURNS TRIGGER AS $$
BEGIN
    -- Set default values for new suggestions
    NEW.is_approved = false;
    NEW.suggested_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle new service suggestions
CREATE OR REPLACE FUNCTION public.handle_new_service_suggestion()
RETURNS TRIGGER AS $$
BEGIN
    -- Set default values for new suggestions
    NEW.is_approved = false;
    NEW.suggested_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for new suggestions
CREATE TRIGGER handle_new_tool_suggestion
    BEFORE INSERT ON public.tools
    FOR EACH ROW
    WHEN (NEW.suggested_by IS NOT NULL)
    EXECUTE FUNCTION public.handle_new_tool_suggestion();

CREATE TRIGGER handle_new_service_suggestion
    BEFORE INSERT ON public.services
    FOR EACH ROW
    WHEN (NEW.suggested_by IS NOT NULL)
    EXECUTE FUNCTION public.handle_new_service_suggestion();

-- Add RLS policies for suggestions
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow users to view approved tools and services
CREATE POLICY "Allow viewing approved tools"
    ON public.tools
    FOR SELECT
    USING (is_approved = true);

CREATE POLICY "Allow viewing approved services"
    ON public.services
    FOR SELECT
    USING (is_approved = true);

-- Allow users to suggest new tools and services
CREATE POLICY "Allow suggesting new tools"
    ON public.tools
    FOR INSERT
    WITH CHECK (auth.uid() = suggested_by);

CREATE POLICY "Allow suggesting new services"
    ON public.services
    FOR INSERT
    WITH CHECK (auth.uid() = suggested_by);

-- Allow admins to manage all tools and services
CREATE POLICY "Allow admins to manage tools"
    ON public.tools
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    ));

CREATE POLICY "Allow admins to manage services"
    ON public.services
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )); 