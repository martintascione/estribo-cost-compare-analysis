import { useState } from 'react';

export interface Proveedor {
  id: string;
  nombre: string;
  precioPorKg: number;
}

export interface Estribo {
  id: string;
  medida: string;
  peso: number;
}

export interface ConfiguracionVenta {
  margenGanancia: number; // porcentaje
  iva: number; // porcentaje
}

export interface CalculoDetallado {
  estribo: Estribo;
  proveedor: Proveedor;
  costoBase: number;
  costoConMargen: number;
  precioFinalSinIva: number;
  precioFinalConIva: number;
  ivaAmount: number;
}

export const useEstribosData = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([
    { id: '1', nombre: 'Proveedor Enrique', precioPorKg: 2500 },
    { id: '2', nombre: 'Proveedor Chino', precioPorKg: 1353.71 }
  ]);

  const [estribos, setEstribos] = useState<Estribo[]>([
    { id: '1', medida: '10x10 cm', peso: 0.0350 },
    { id: '2', medida: '12x12 cm', peso: 0.0404 },
    { id: '3', medida: '15x15 cm', peso: 0.0485 },
    { id: '4', medida: '10x15 cm', peso: 0.0418 },
    { id: '5', medida: '20x20 cm', peso: 0.0620 }
  ]);

  const [configuracion, setConfiguracion] = useState<ConfiguracionVenta>({
    margenGanancia: 90,
    iva: 21
  });

  const agregarProveedor = (proveedor: Omit<Proveedor, 'id'>) => {
    const nuevoProveedor = { ...proveedor, id: Date.now().toString() };
    setProveedores(prev => [...prev, nuevoProveedor]);
  };

  const agregarEstribo = (estribo: Omit<Estribo, 'id'>) => {
    const nuevoEstribo = { ...estribo, id: Date.now().toString() };
    setEstribos(prev => [...prev, nuevoEstribo]);
  };

  const eliminarProveedor = (id: string) => {
    setProveedores(prev => prev.filter(p => p.id !== id));
  };

  const eliminarEstribo = (id: string) => {
    setEstribos(prev => prev.filter(e => e.id !== id));
  };

  const calcularDatos = (): CalculoDetallado[] => {
    const calculos: CalculoDetallado[] = [];
    
    estribos.forEach(estribo => {
      proveedores.forEach(proveedor => {
        const costoBase = estribo.peso * proveedor.precioPorKg;
        const costoConMargen = costoBase * (1 + configuracion.margenGanancia / 100);
        const ivaAmount = costoConMargen * (configuracion.iva / 100);
        const precioFinalConIva = costoConMargen + ivaAmount;
        
        calculos.push({
          estribo,
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
        estribo,
        proveedores: calculosEstribo.map(calculo => ({
          proveedor: calculo.proveedor,
          costoTotal1000: calculo.costoBase * 1000,
          ventaTotal1000SinIva: calculo.precioFinalSinIva * 1000,
          ventaTotal1000ConIva: calculo.precioFinalConIva * 1000,
          ivaTotal1000: calculo.ivaAmount * 1000,
          gananciaTotal1000: (calculo.precioFinalSinIva - calculo.costoBase) * 1000
        }))
      };
    });
  };

  return {
    proveedores,
    estribos,
    configuracion,
    setConfiguracion,
    agregarProveedor,
    agregarEstribo,
    eliminarProveedor,
    eliminarEstribo,
    calcularDatos,
    calcularSimulacionVentas
  };
};