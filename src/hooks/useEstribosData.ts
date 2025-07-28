import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Proveedor {
  id: string;
  nombre: string;
  precioPorKg: number;
}

export interface Estribo {
  id: string;
  medida: string;
  pesosPorProveedor: { [proveedorId: string]: number }; // Peso específico por proveedor
}

export interface ConfiguracionVenta {
  margenGanancia: number; // porcentaje
  iva: number; // porcentaje
}

export interface PrecioPorUnidad {
  id: string;
  estriboPrecioId: string;
  medida: string;
  precioUnitario: number;
}

export interface CalculoDetallado {
  estribo: Estribo & { peso: number }; // Incluye peso específico para el proveedor
  proveedor: Proveedor;
  costoBase: number;
  costoConMargen: number;
  precioFinalSinIva: number;
  precioFinalConIva: number;
  ivaAmount: number;
}

export const useEstribosData = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [estribos, setEstribos] = useState<Estribo[]>([]);
  const [preciosPorUnidad, setPreciosPorUnidad] = useState<PrecioPorUnidad[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionVenta>({
    margenGanancia: 90,
    iva: 21
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase al inicializar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar proveedores
      const { data: proveedoresData, error: proveedoresError } = await supabase
        .from('proveedores')
        .select('*')
        .order('nombre');
      
      if (proveedoresError) throw proveedoresError;
      
      // Cargar estribos con sus pesos
      const { data: estribosData, error: estribosError } = await supabase
        .from('estribos')
        .select(`
          *,
          estribo_pesos (
            proveedor_id,
            peso
          )
        `)
        .order('medida');
      
      if (estribosError) throw estribosError;
      
      // Cargar configuración
      const { data: configData, error: configError } = await supabase
        .from('configuracion_venta')
        .select('*')
        .single();
      
      if (configError) throw configError;
      
      // Cargar precios por unidad
      const { data: preciosData, error: preciosError } = await supabase
        .from('precios_por_unidad')
        .select(`
          *,
          estribos!inner (
            medida
          )
        `);
      
      if (preciosError && preciosError.code !== 'PGRST116') throw preciosError;
      
      // Transformar datos
      const proveedoresTransformados: Proveedor[] = proveedoresData?.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precioPorKg: Number(p.precio_por_kg)
      })) || [];
      
      const estribosTransformados: Estribo[] = estribosData?.map(e => ({
        id: e.id,
        medida: e.medida,
        pesosPorProveedor: e.estribo_pesos?.reduce((acc: any, peso: any) => {
          acc[peso.proveedor_id] = Number(peso.peso);
          return acc;
        }, {}) || {}
      })) || [];
      
      // Transformar precios por unidad
      const preciosTransformados: PrecioPorUnidad[] = preciosData?.map(p => ({
        id: p.id,
        estriboPrecioId: p.estribo_id,
        medida: (p as any).estribos.medida,
        precioUnitario: Number(p.precio_unitario)
      })) || [];
      
      setProveedores(proveedoresTransformados);
      setEstribos(estribosTransformados);
      setPreciosPorUnidad(preciosTransformados);
      setConfiguracion({
        margenGanancia: Number(configData?.margen_ganancia || 90),
        iva: Number(configData?.iva || 21)
      });
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos desde la base de datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const agregarProveedor = async (proveedor: Omit<Proveedor, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('proveedores')
        .insert({
          nombre: proveedor.nombre,
          precio_por_kg: proveedor.precioPorKg
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const nuevoProveedor: Proveedor = {
        id: data.id,
        nombre: data.nombre,
        precioPorKg: Number(data.precio_por_kg)
      };
      
      setProveedores(prev => [...prev, nuevoProveedor]);
      
      toast({
        title: "Éxito",
        description: "Proveedor agregado correctamente"
      });
    } catch (error) {
      console.error('Error agregando proveedor:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el proveedor",
        variant: "destructive"
      });
    }
  };

  const agregarEstribo = async (estribo: Omit<Estribo, 'id'>) => {
    try {
      // Insertar estribo
      const { data: estriboDatos, error: estribosError } = await supabase
        .from('estribos')
        .insert({
          medida: estribo.medida
        })
        .select()
        .single();
      
      if (estribosError) throw estribosError;
      
      // Insertar pesos por proveedor
      const pesosData = Object.entries(estribo.pesosPorProveedor).map(([proveedorId, peso]) => ({
        estribo_id: estriboDatos.id,
        proveedor_id: proveedorId,
        peso: peso
      }));
      
      const { error: pesosError } = await supabase
        .from('estribo_pesos')
        .insert(pesosData);
      
      if (pesosError) throw pesosError;
      
      const nuevoEstribo: Estribo = {
        id: estriboDatos.id,
        medida: estriboDatos.medida,
        pesosPorProveedor: estribo.pesosPorProveedor
      };
      
      setEstribos(prev => [...prev, nuevoEstribo]);
      
      toast({
        title: "Éxito",
        description: "Estribo agregado correctamente"
      });
    } catch (error) {
      console.error('Error agregando estribo:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el estribo",
        variant: "destructive"
      });
    }
  };

  const eliminarProveedor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('proveedores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProveedores(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: "Éxito",
        description: "Proveedor eliminado correctamente"
      });
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proveedor",
        variant: "destructive"
      });
    }
  };

  const eliminarEstribo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estribos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setEstribos(prev => prev.filter(e => e.id !== id));
      
      toast({
        title: "Éxito",
        description: "Estribo eliminado correctamente"
      });
    } catch (error) {
      console.error('Error eliminando estribo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el estribo",
        variant: "destructive"
      });
    }
  };

  const actualizarConfiguracion = async (nuevaConfiguracion: ConfiguracionVenta) => {
    try {
      const { error } = await supabase
        .from('configuracion_venta')
        .update({
          margen_ganancia: nuevaConfiguracion.margenGanancia,
          iva: nuevaConfiguracion.iva
        })
        .eq('id', (await supabase.from('configuracion_venta').select('id').single()).data?.id);
      
      if (error) throw error;
      
      setConfiguracion(nuevaConfiguracion);
      
      toast({
        title: "Éxito",
        description: "Configuración actualizada correctamente"
      });
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive"
      });
    }
  };

  const actualizarPrecioPorUnidad = async (estriboPrecioId: string, precio: number) => {
    try {
      // Verificar si ya existe un precio para este estribo
      const precioExistente = preciosPorUnidad.find(p => p.estriboPrecioId === estriboPrecioId);
      
      if (precioExistente) {
        // Actualizar precio existente
        const { error } = await supabase
          .from('precios_por_unidad')
          .update({ precio_unitario: precio })
          .eq('estribo_id', estriboPrecioId);
        
        if (error) throw error;
        
        setPreciosPorUnidad(prev => 
          prev.map(p => 
            p.estriboPrecioId === estriboPrecioId 
              ? { ...p, precioUnitario: precio }
              : p
          )
        );
      } else {
        // Crear nuevo precio
        const estribo = estribos.find(e => e.id === estriboPrecioId);
        if (!estribo) throw new Error('Estribo no encontrado');
        
        const { data, error } = await supabase
          .from('precios_por_unidad')
          .insert({
            estribo_id: estriboPrecioId,
            precio_unitario: precio
          })
          .select()
          .single();
        
        if (error) throw error;
        
        const nuevoPrecio: PrecioPorUnidad = {
          id: data.id,
          estriboPrecioId: data.estribo_id,
          medida: estribo.medida,
          precioUnitario: Number(data.precio_unitario)
        };
        
        setPreciosPorUnidad(prev => [...prev, nuevoPrecio]);
      }
      
      toast({
        title: "Éxito",
        description: "Precio por unidad actualizado correctamente"
      });
    } catch (error) {
      console.error('Error actualizando precio por unidad:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el precio por unidad",
        variant: "destructive"
      });
    }
  };

  const calcularDatos = (): CalculoDetallado[] => {
    const calculos: CalculoDetallado[] = [];
    
    estribos.forEach(estribo => {
      proveedores.forEach(proveedor => {
        const pesoEspecifico = estribo.pesosPorProveedor[proveedor.id] || 0;
        const costoBase = pesoEspecifico * proveedor.precioPorKg;
        const costoConMargen = costoBase * (1 + configuracion.margenGanancia / 100);
        const ivaAmount = costoConMargen * (configuracion.iva / 100);
        const precioFinalConIva = costoConMargen + ivaAmount;
        
        calculos.push({
          estribo: {
            ...estribo,
            peso: pesoEspecifico // Para compatibilidad con componentes existentes
          },
          proveedor,
          costoBase,
          costoConMargen,
          precioFinalSinIva: costoConMargen,
          precioFinalConIva,
          ivaAmount
        });
      });
    });
    
    return calculos;
  };

  const calcularSimulacionVentas = () => {
    const calculosDetallados = calcularDatos();
    const estribosTop3 = estribos.slice(0, 3);
    
    return estribosTop3.map(estribo => {
      const calculosEstribo = calculosDetallados.filter(c => c.estribo.id === estribo.id);
      
      return {
        estribo: {
          medida: estribo.medida,
          peso: 0 // Ya no necesitamos este campo genérico
        },
        proveedores: calculosEstribo.map(calculo => {
          const costoTotal1000 = calculo.costoBase * 1000;
          const ventaTotal1000ConIva = calculo.precioFinalConIva * 1000;
          const ivaDebito1000 = calculo.ivaAmount * 1000;
          const ivaCredito1000 = costoTotal1000 * (21 / 121);
          const ivaAPagar1000 = ivaDebito1000 - ivaCredito1000;
          
          return {
            proveedor: calculo.proveedor,
            peso: calculo.estribo.peso,
            costoTotal1000,
            ventaTotal1000SinIva: calculo.precioFinalSinIva * 1000,
            ventaTotal1000ConIva,
            ivaDebito1000,
            ivaCredito1000,
            ivaAPagar1000,
            gananciaTotal1000: ventaTotal1000ConIva - costoTotal1000 - ivaAPagar1000 // Venta - Costo - IVA Neto
          };
        })
      };
    });
  };

  // Nuevas funciones para precios por unidad
  const calcularDatosPorUnidad = () => {
    const calculos: any[] = [];
    
    estribos.forEach(estribo => {
      const precioPorUnidad = preciosPorUnidad.find(p => p.estriboPrecioId === estribo.id);
      if (!precioPorUnidad || precioPorUnidad.precioUnitario === 0) return;
      
      proveedores.forEach(proveedor => {
        const pesoEspecifico = estribo.pesosPorProveedor[proveedor.id] || 0;
        const costoBase = pesoEspecifico * proveedor.precioPorKg;
        const precioVentaFijo = precioPorUnidad.precioUnitario;
        const ivaAmount = precioVentaFijo * (configuracion.iva / (100 + configuracion.iva));
        const precioSinIva = precioVentaFijo - ivaAmount;
        
        calculos.push({
          estribo: {
            ...estribo,
            peso: pesoEspecifico
          },
          proveedor,
          costoBase,
          precioVentaFijo,
          precioFinalSinIva: precioSinIva,
          precioFinalConIva: precioVentaFijo,
          ivaAmount
        });
      });
    });
    
    return calculos;
  };

  const calcularSimulacionVentasPorUnidad = () => {
    const calculosDetallados = calcularDatosPorUnidad();
    const estribosConPrecios = estribos.filter(e => 
      preciosPorUnidad.some(p => p.estriboPrecioId === e.id && p.precioUnitario > 0)
    ).slice(0, 3);
    
    return estribosConPrecios.map(estribo => {
      const calculosEstribo = calculosDetallados.filter(c => c.estribo.id === estribo.id);
      
      return {
        estribo: {
          medida: estribo.medida,
          peso: 0
        },
        proveedores: calculosEstribo.map(calculo => {
          const costoTotal1000 = calculo.costoBase * 1000;
          const precioUnitario = calculo.precioVentaFijo;
          const ventaTotal1000ConIva = precioUnitario * 1000;
          const ivaDebito1000 = calculo.ivaAmount * 1000;
          const ivaCredito1000 = costoTotal1000 * (21 / 121);
          const ivaAPagar1000 = ivaDebito1000 - ivaCredito1000;
          
          return {
            proveedor: calculo.proveedor,
            peso: calculo.estribo.peso,
            costoTotal1000,
            ventaTotal1000SinIva: calculo.precioFinalSinIva * 1000,
            ventaTotal1000ConIva,
            ivaDebito1000,
            ivaCredito1000,
            ivaAPagar1000,
            gananciaTotal1000: ventaTotal1000ConIva - costoTotal1000 - ivaAPagar1000
          };
        })
      };
    });
  };

  return {
    proveedores,
    estribos,
    preciosPorUnidad,
    configuracion,
    loading,
    setConfiguracion,
    agregarProveedor,
    agregarEstribo,
    eliminarProveedor,
    eliminarEstribo,
    actualizarConfiguracion,
    actualizarPrecioPorUnidad,
    calcularDatos,
    calcularDatosPorUnidad,
    calcularSimulacionVentas,
    calcularSimulacionVentasPorUnidad,
    cargarDatos
  };
};