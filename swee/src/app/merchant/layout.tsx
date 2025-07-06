import MerchantLayout from '@/components/merchant/MerchantLayout';

export default function MerchantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MerchantLayout>{children}</MerchantLayout>;
}
