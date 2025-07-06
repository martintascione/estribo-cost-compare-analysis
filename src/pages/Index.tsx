import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { useEstribosData } from "@/hooks/useEstribosData";
import { FormularioProveedores } from "@/components/FormularioProveedores";
import { FormularioEstribos } from "@/components/FormularioEstribos";
import { ConfiguracionVenta } from "@/components/ConfiguracionVenta";
import { ComparacionPrecios } from "@/components/ComparacionPrecios";
import { SimulacionVentas } from "@/components/SimulacionVentas";

const Index = () => {
  const {
    proveedores,
    estribos,
    configuracion,
    loading,
    setConfiguracion,
    agregarProveedor,
    agregarEstribo,
    eliminarProveedor,
    eliminarEstribo,
    actualizarConfiguracion,
    calcularDatos,
    calcularSimulacionVentas
  } = useEstribosData();

  const calculosDetallados = calcularDatos();
  const simulacionVentas = calcularSimulacionVentas();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Sistema de Análisis de Costos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Calculadora de Estribos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistema completo para análisis de costos, precios de venta y simulaciones financieras
          </p>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="configuracion" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
            <TabsTrigger value="configuracion" className="flex-col gap-1 py-3">
              <span className="font-medium">Configuración</span>
              <span className="text-xs text-muted-foreground">Datos de entrada</span>
            </TabsTrigger>
            <TabsTrigger value="analisis" className="flex-col gap-1 py-3">
              <span className="font-medium">Análisis</span>
              <span className="text-xs text-muted-foreground">Comparación y precios</span>
            </TabsTrigger>
            <TabsTrigger value="simulacion" className="flex-col gap-1 py-3">
              <span className="font-medium">Simulación</span>
              <span className="text-xs text-muted-foreground">Ventas masivas</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab de Configuración */}
          <TabsContent value="configuracion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormularioProveedores
                proveedores={proveedores}
                onAgregarProveedor={agregarProveedor}
                onEliminarProveedor={eliminarProveedor}
              />
              
              <FormularioEstribos
                estribos={estribos}
                proveedores={proveedores}
                onAgregarEstribo={agregarEstribo}
                onEliminarEstribo={eliminarEstribo}
              />
            </div>
            
            <ConfiguracionVenta
              configuracion={configuracion}
              onCambiarConfiguracion={setConfiguracion}
              onActualizarConfiguracion={actualizarConfiguracion}
            />
          </TabsContent>

          {/* Tab de Análisis */}
          <TabsContent value="analisis" className="space-y-6">
            <ComparacionPrecios calculos={calculosDetallados} />
          </TabsContent>

          {/* Tab de Simulación */}
          <TabsContent value="simulacion" className="space-y-6">
            <SimulacionVentas simulacion={simulacionVentas} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;