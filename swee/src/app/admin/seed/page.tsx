import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSeedPage() {
  const handleSeedData = async () => {
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        alert('Sample data populated successfully!');
        window.location.reload();
      } else {
        alert('Failed to populate data: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error populating data');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin - Database Setup</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Populate Sample Data</CardTitle>
            <CardDescription>
              This will create sample merchants, services, service tags, and a demo user 
              to test the recommendation system and other features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>This will create:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>24 Service tags (hair concerns, facial concerns, style preferences)</li>
                  <li>3 Sample merchants (Hair Studio, Glow Spa, Brow & Lash Bar)</li>
                  <li>6 Sample services with proper tag associations</li>
                  <li>1 Demo user with quiz answers for testing recommendations</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleSeedData}
                className="w-full"
                size="lg"
              >
                Populate Sample Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
