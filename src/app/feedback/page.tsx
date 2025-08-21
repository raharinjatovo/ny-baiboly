/**
 * Feedback page - User feedback and suggestions
 */

import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Github } from "lucide-react";

export default function FeedbackPage() {
  return (
    <Layout>
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Hanome hevitra
          </h1>
          <p className="text-lg text-muted-foreground">
            Ny hevitrao sy ny sosokevitrao dia sarobidy ho anay. 
            Azafady, zarao aminay ny traikefanao sy ny fisainao.
          </p>
        </section>

        {/* Feedback Options */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Fomba hanomezana hevitra
              </CardTitle>
              <CardDescription>
                Misafidiana ny fomba mety aminao indrindra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Github className="h-5 w-5" />
                      GitHub Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Ampidiro ny olana, sosokevitra, na fangatahana endri-javatra vaovao.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <a 
                        href="https://github.com/your-repo/ny-baiboly/issues" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Hanokatra Issue
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Mandefa mailaka raha manana fanontaniana manokana.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <a href="mailto:contact@nybaiboly.mg">
                        <Mail className="h-4 w-4 mr-2" />
                        Mandefa mailaka
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Karazana hevitra</CardTitle>
              <CardDescription>
                Ireto ny karazana hevitra azonao omena
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Ara-teknika</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Olana amin'ny fampiasana</li>
                    <li>• Fahamendrehana sy hafainganam-pandeha</li>
                    <li>• Tsy fahombiazan'ny fikarohana</li>
                    <li>• Olana amin'ny fanehoana</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Endri-javatra</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Endri-javatra vaovao</li>
                    <li>• Fanatsarana ny UX/UI</li>
                    <li>• Fifindrana sy fanodinana</li>
                    <li>• Fanehoana angon-drakitra</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Torolalana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Lazao mazava:</strong> Raiso fotoana hazavaina ny olana na ny sosokevitra
              </p>
              <p>
                <strong>Omeo sary raha azo atao:</strong> Ny screenshots dia manampy amin'ny fahatakarana ny olana
              </p>
              <p>
                <strong>Lazao ny tontolo ampiasainao:</strong> Browser, takelaka, na finday ampiasaina
              </p>
              <p>
                <strong>Mba mirary:</strong> Mitandrina fitiavana sy fanajana amin'ny fifandraisana
              </p>
            </CardContent>
          </Card>

          {/* Thank You */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Misaotra!</h3>
              <p className="text-muted-foreground">
                Ny fandraisanao anjara dia manampy anay hanatsara ity fampiharana ity 
                ho an'ny mpampiasa rehetra. Isaky ny hevitra omenao dia jerena sy dinihina mazava.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
