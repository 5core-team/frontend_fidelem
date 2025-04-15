
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      title: "Comment obtenir le meilleur taux pour votre crédit immobilier",
      excerpt: "Découvrez nos conseils d'experts pour optimiser votre dossier de crédit immobilier...",
      author: "Marie Dubois",
      date: "15 avril 2025",
      category: "Crédit immobilier"
    },
    {
      title: "Les avantages du crédit à la consommation responsable",
      excerpt: "Le crédit à la consommation peut être un outil financier intéressant lorsqu'il est bien utilisé...",
      author: "Thomas Martin",
      date: "14 avril 2025",
      category: "Crédit consommation"
    },
    {
      title: "5 erreurs à éviter lors d'une demande de crédit",
      excerpt: "Ne laissez pas ces erreurs communes compromettre vos chances d'obtenir un crédit...",
      author: "Sophie Bernard",
      date: "13 avril 2025",
      category: "Conseils"
    }
  ];

  return (
    <div className="min-h-screen bg-fidelem-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fidelem mb-4">Blog Fidelem</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Actualités, conseils et guides pratiques sur le crédit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-sm text-fidelem font-medium mb-2">{post.category}</div>
                <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {post.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
