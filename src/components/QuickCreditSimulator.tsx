
import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface QuickCreditSimulatorProps {
  className?: string;
}

export const QuickCreditSimulator = ({ className }: QuickCreditSimulatorProps) => {
  const [amount, setAmount] = useState(25000);
  const [duration, setDuration] = useState(48);
  const [rate, setRate] = useState(5); // Taux par défaut
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  };

  useEffect(() => {
    const payment = calculateMonthlyPayment(amount, rate, duration);
    setMonthlyPayment(payment);
  }, [amount, duration, rate]);

  return (
    <div className="relative transition-all duration-500 opacity-100 transform translate-y-0">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-fidelem text-lg">Simulation de crédit</h3>
            <div className="bg-fidelem text-white p-1 rounded-full">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Montant du crédit</p>
              <p className="text-lg font-semibold">{amount.toLocaleString('fr-FR')} F</p>
              <Slider
                defaultValue={[amount]}
                max={100000}
                min={1000}
                step={1000}
                onValueChange={(value) => setAmount(value[0])}
                className="mt-2"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Durée du crédit</p>
              <p className="text-lg font-semibold">{duration} mois</p>
              <Slider
                defaultValue={[duration]}
                max={120}
                min={12}
                step={12}
                onValueChange={(value) => setDuration(value[0])}
                className="mt-2"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">Taux d'intérêt</p>
              <p className="text-lg font-semibold">{rate}%</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    rate === 5
                      ? "bg-fidelem text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setRate(5)}
                >
                  Taux standard - 5%
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    rate === 7
                      ? "bg-fidelem text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setRate(7)}
                >
                  Taux majoré - 7%
                </button>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-500">Mensualité estimée</p>
              <p className="text-2xl font-bold text-fidelem">
                {monthlyPayment.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} F
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 bg-fidelem-secondary text-fidelem p-2 rounded-lg shadow-lg transform rotate-12">
        <div className="text-sm font-medium">Réponse rapide</div>
      </div>
    </div>
  );
};
