-- Crear tabla para precios fijos por unidad por medida
CREATE TABLE public.precios_por_unidad (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estribo_id UUID NOT NULL,
  precio_unitario NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT precios_por_unidad_estribo_id_fkey 
    FOREIGN KEY (estribo_id) REFERENCES public.estribos(id) ON DELETE CASCADE
);

-- Índice único para evitar duplicados por estribo
CREATE UNIQUE INDEX idx_precios_por_unidad_estribo_id 
  ON public.precios_por_unidad(estribo_id);

-- Habilitar RLS
ALTER TABLE public.precios_por_unidad ENABLE ROW LEVEL SECURITY;

-- Política permisiva para acceso total
CREATE POLICY "Permitir acceso total a precios_por_unidad" 
ON public.precios_por_unidad 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_precios_por_unidad_updated_at
  BEFORE UPDATE ON public.precios_por_unidad
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();