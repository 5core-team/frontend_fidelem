
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const FIXED_RATES = [
  { value: 5, label: "Taux standard - 5%" },
  { value: 7, label: "Taux majoré - 7%" }
];

interface CreditSimulatorProps {
  className?: string;
}

const CreditSimulator = ({ className }: CreditSimulatorProps) => {
  const [amount, setAmount] = useState(25000);
  const [duration, setDuration] = useState(48);
  const [selectedRate, setSelectedRate] = useState(FIXED_RATES[0]);
  const [simulating, setSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<null | {
    monthlyPayment: number;
    totalInterest: number;
    totalAmount: number;
    amortizationSchedule: { month: number; principal: number; interest: number; balance: number }[];
  }>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  };

  const handleSimulate = () => {
    setSimulating(true);
    
    setTimeout(() => {
      const monthlyPayment = calculateMonthlyPayment(amount, selectedRate.value, duration);
      const totalAmount = monthlyPayment * duration;
      const totalInterest = totalAmount - amount;
      
      const schedule = [];
      let remainingBalance = amount;
      
      for (let month = 1; month <= duration; month++) {
        const interestPayment = remainingBalance * (selectedRate.value / 100 / 12);
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        
        schedule.push({
          month,
          principal: principalPayment,
          interest: interestPayment,
          balance: remainingBalance > 0 ? remainingBalance : 0
        });
      }
      
      setSimulationResults({
        monthlyPayment,
        totalInterest,
        totalAmount,
        amortizationSchedule: schedule
      });
      
      setSimulating(false);
    }, 1000);
  };

  const chartData = simulationResults?.amortizationSchedule
    .filter((_, index) => index % 6 === 0 || index === duration - 1)
    .map(item => ({
      month: item.month,
      principal: amount - item.balance,
      interest: item.month * simulationResults.monthlyPayment - (amount - item.balance)
    }));

  return (
    <Card className={`border shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-fidelem">Simulateur de crédit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Montant du crédit</Label>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            <Slider
              id="amount"
              min={1000}
              max={100000}
              step={1000}
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1,000 €</span>
              <span>100,000 €</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="duration">Durée (mois)</Label>
              <span className="font-medium">{duration} mois</span>
            </div>
            <Slider
              id="duration"
              min={12}
              max={120}
              step={12}
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>12 mois</span>
              <span>120 mois</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Taux d'intérêt</Label>
            <div className="grid grid-cols-2 gap-4">
              {FIXED_RATES.map((rate) => (
                <Button
                  key={rate.value}
                  type="button"
                  variant={selectedRate.value === rate.value ? "default" : "outline"}
                  className={selectedRate.value === rate.value ? "bg-fidelem hover:bg-fidelem/90" : ""}
                  onClick={() => setSelectedRate(rate)}
                >
                  {rate.label}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSimulate} 
            disabled={simulating}
            className="bg-fidelem hover:bg-fidelem/90 w-full"
          >
            {simulating ? "Calcul en cours..." : "Simuler mon crédit"}
          </Button>
        </div>

        {simulationResults && (
          <div className="mt-6 space-y-6">
            <div className="rounded-lg bg-fidelem-light p-4">
              <h3 className="text-lg font-semibold mb-4">Résultats de la simulation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mensualité estimée</p>
                  <p className="text-xl font-bold text-fidelem">
                    {formatCurrency(simulationResults.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total des intérêts</p>
                  <p className="text-xl font-bold text-fidelem">
                    {formatCurrency(simulationResults.totalInterest)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coût total du crédit</p>
                  <p className="text-xl font-bold text-fidelem">
                    {formatCurrency(simulationResults.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-72">
              <h3 className="text-lg font-semibold mb-4">Répartition du remboursement</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Mois', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    tickFormatter={(value) => `${Math.round(value / 1000)}k€`} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']} 
                    labelFormatter={(label) => `Mois ${label}`} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="principal" 
                    name="Capital remboursé" 
                    stroke="#0F3460" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interest" 
                    name="Intérêts payés" 
                    stroke="#3EDBF0" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-gray-500 max-w-prose text-center">
          Ce simulateur est fourni à titre informatif. Les taux d'intérêt et les conditions finales peuvent varier selon votre profil et la politique de notre établissement.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CreditSimulator;
