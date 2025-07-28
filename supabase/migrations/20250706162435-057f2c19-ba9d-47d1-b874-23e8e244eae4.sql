-- Crear tabla para proveedores
CREATE TABLE public.proveedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio_por_kg NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para estribos
CREATE TABLE public.estribos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medida TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para pesos de estribos por proveedor
CREATE TABLE public.estribo_pesos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estribo_id UUID NOT NULL REFERENCES public.estribos(id) ON DELETE CASCADE,
  proveedor_id UUID NOT NULL REFERENCES public.proveedores(id) ON DELETE CASCADE,
  peso NUMERIC(10,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(estribo_id, proveedor_id)
);

-- Crear tabla para configuración de venta
CREATE TABLE public.configuracion_venta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  margen_ganancia NUMERIC(5,2) NOT NULL DEFAULT 90,
  iva NUMERIC(5,2) NOT NULL DEFAULT 21,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insertar configuración inicial
INSERT INTO public.configuracion_venta (margen_ganancia, iva) VALUES (90, 21);

-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps
CREATE TRIGGER update_proveedores_updated_at
  BEFORE UPDATE ON public.proveedores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estribos_updated_at
  BEFORE UPDATE ON public.estribos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estribo_pesos_updated_at
  BEFORE UPDATE ON public.estribo_pesos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configuracion_venta_updated_at
  BEFORE UPDATE ON public.configuracion_venta
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_estribo_pesos_estribo_id ON public.estribo_pesos(estribo_id);
CREATE INDEX idx_estribo_pesos_proveedor_id ON public.estribo_pesos(proveedor_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estribos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estribo_pesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion_venta ENABLE ROW LEVEL SECURITY;

-- Crear políticas permisivas para acceso público (sin autenticación)
CREATE POLICY "Permitir acceso total a proveedores" ON public.proveedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso total a estribos" ON public.estribos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso total a estribo_pesos" ON public.estribo_pesos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acceso total a configuracion_venta" ON public.configuracion_venta FOR ALL USING (true) WITH CHECK (true);