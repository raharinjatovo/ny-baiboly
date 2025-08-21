/**
 * About page - Information about the Bible application
 */

import Link from "next/link";
import { Book, Heart, Users, Globe, Github } from "lucide-react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <Layout>
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            Momba ny Baiboly
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fampiharana natao ho an'ny fampianaran'ny Tenin'Andriamanitra 
            amin'ny teny Malagasy ho an'ny rehetra, maimaim-poana sy malalaka.
          </p>
        </section>

        {/* Mission Section */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Ny anjara asanay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ny tanjonay dia ny hanome fahafahana ho an'ny Malagasy rehetra 
                hamaky sy hianatra ny Baiboly amin'ny fiteniny. Mino izahay fa 
                ny Tenin'Andriamanitra dia tokony ho azon'ny rehetra idirana 
                sy azoko tsara.
              </p>
              <p className="text-muted-foreground">
                Ity fampiharana ity dia nataon'ny fitiavana ho an'i Kristy sy 
                ny faniriana hizara ny Teniny amin'ny fomba mora ampiasaina sy 
                maoderina.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-6 w-6 text-blue-500" />
                Boky 66 feno
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ny Testameta Taloha sy ny Testameta Vaovao feno, 
                miaraka amin'ny fikarohana mahery sy ny navigation mora.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-green-500" />
                Teny Malagasy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Natao manokana ho an'ny mpamaky teny Malagasy, 
                miaraka amin'ny dikanteny sy ny fomba faminianana mahazatra.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-500" />
                Maimaim-poana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fampiharana maimaim-poana tanteraka, tsy misy fividianana na 
                fanaraha-maso. Ny Tenin'Andriamanitra dia tokony ho an'ny rehetra.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-6 w-6 text-gray-500" />
                Open Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ny kaody dia malalaka sy azo ovaina, mandroso miaraka 
                amin'ny vondrom-piarahamonina.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Technology Section */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teknolojia nampiasaina</CardTitle>
              <CardDescription>
                Naorina tamin'ny teknolojia maoderina sy azo itokisana
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground">Frontend</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Next.js 15 (React Framework)</li>
                    <li>• TypeScript (Type Safety)</li>
                    <li>• Tailwind CSS (Styling)</li>
                    <li>• Shadcn/ui (UI Components)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Data & Performance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• JSON Bible Data</li>
                    <li>• Advanced Caching</li>
                    <li>• Progressive Web App</li>
                    <li>• Responsive Design</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Data Source Section */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loharanon-kevitra</CardTitle>
              <CardDescription>
                Misaotra ireo nanampy tamin'ny fananganana ity fampiharana ity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Angon-drakitra Baiboly</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ny angon-drakitra Baiboly ampiasaina eto dia avy amin'ny tahiry JSON 
                    natao ho an'ny mpampiasa Malagasy.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link 
                      href="https://github.com/RaveloMevaSoavina/baiboly-json" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Jereo ny tahiry JSON
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fifandraisana</CardTitle>
              <CardDescription>
                Manana fanontaniana na soso-kevitra?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Raha manana fanontaniana, soso-kevitra, na te handray anjara 
                amin'ny fivoarana ity fampiharana ity ianao, azafady mifandraisa aminay.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline">
                  <Link href="/feedback">
                    Hanome hevitra
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link 
                    href="https://github.com/your-repo/ny-baiboly" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Acknowledgments */}
        <section className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Fisaorana
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Misaotra ho an'ireo rehetra izay nanampy tamin'ny fananganana 
            ity fampiharana ity. Manantena izahay fa hanampy anao 
            amin'ny dianao amin'ny fianarana ny Tenin'Andriamanitra.
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Nataon'ny fitiavana ho an'i Kristy</span>
          </div>
        </section>
      </div>
    </Layout>
  );
}
