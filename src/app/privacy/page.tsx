/**
 * Privacy Policy page - Data usage and privacy information
 */

import Link from "next/link";
import { Info, AlertTriangle, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Politika momba ny fiainana manokana
          </h1>
          <p className="text-lg text-muted-foreground">
            Fampahalalana momba ny fampiasana ny angon-drakitra sy ny fiarovana ny fiainana manokana
          </p>
          <p className="text-sm text-muted-foreground">
            Nohavaozina farany: {new Date().toLocaleDateString('mg-MG')}
          </p>
        </section>

        {/* Disclaimer Alert */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Fampandrenesana lehibe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 dark:text-amber-300">
              Ity fampiharana ity dia omena "toy izany" sy tsy misy antoka. 
              Ny mpamorona dia tsy mandray andraikitra amin'ny fampiasana ny angon-drakitra, 
              ny fitandremana, na ny vokatra rehetra avy amin'ny fampiasana ity fampiharana ity.
            </p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-6 w-6 text-blue-500" />
              Angon-drakitra voaangona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Angon-drakitra tsy manokana</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Karazana mpitsirona (browser) ampiasaina</li>
                <li>• Fotoana sy ora nidirana</li>
                <li>• Pejy voatsidika</li>
                <li>• Angon-drakitra momba ny fomba fampiasana ny fampiharana</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Angon-drakitra tsy tehirizina</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Anarana manokana na adiresy mailaka</li>
                <li>• Angon-drakitra ara-bola</li>
                <li>• Toerana misy anao</li>
                <li>• Angon-drakitra mahasarika anao manokana</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Local Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Fitahirizana eo an-toerana (Local Storage)</CardTitle>
            <CardDescription>
              Angon-drakitra tehirizina eo amin'ny mpitsironanao ihany
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ny fampiharana dia mety hampiasa ny "Local Storage" mba hitehirizana:
            </p>
            <ul className="text-muted-foreground space-y-1 ml-4">
              <li>• Ireo andinin-tsoratra notandreminao (favorites)</li>
              <li>• Ny safidinao momba ny fombafomba (settings)</li>
              <li>• Ny tantara fikarohana farany</li>
              <li>• Ny fikarakarana ny cache ho an'ny fampisehoana tsara</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Ireo angon-drakitra ireo dia tsy miala amin'ny mpitsironanao 
              ary tsy alefa any amin'ny mpizara na orinasa hafa.
            </p>
          </CardContent>
        </Card>

        {/* Third Party Services */}
        <Card>
          <CardHeader>
            <CardTitle>Serivisy hafa</CardTitle>
            <CardDescription>
              Serivisy avy amin'ny orinasa hafa izay mety ampiasaina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Hosting sy CDN</h4>
              <p className="text-muted-foreground">
                Ity fampiharana ity dia mety ho hosting eo amin'ny serivisy toy ny:
              </p>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Vercel, Netlify, na sehatra hosting hafa</li>
                <li>• CDN ho an'ny fitehirizana sary sy rakitra</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Ireo serivisy ireo dia manana ny politika momba ny fiainana manokana ary 
                ny fepetra fampiasana azy ireo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Loharanon'ny angon-drakitra</CardTitle>
            <CardDescription>
              Fampahalalana momba ny angon-drakitra Baiboly ampiasaina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Angon-drakitra Baiboly</h4>
              <p className="text-muted-foreground">
                Ny angon-drakitra Baiboly ampiasaina eto dia avy amin'ny loharano malalaka:
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="https://github.com/RaveloMevaSoavina/baiboly-json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Baiboly JSON Repository
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Ireo angon-drakitra ireo dia fananan'ny tompon'andraikitra 
                amin'io repository io ary tsy fananan'ny mpamorona ity fampiharana ity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Liability Disclaimer */}
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-6 w-6" />
              Fampandrenesana momba ny andraikitra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-red-700 dark:text-red-300">
            <div className="space-y-3">
              <h4 className="font-semibold">Tsy fandraisan'andraikitra</h4>
              <p>
                Ny mpamorona ity fampiharava ity dia tsy mandray andraikitra:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Amin'ny fomba fampiasana ny angon-drakitra avy amin'ity fampiharana ity</li>
                <li>• Amin'ny vokatra na vokatra ratsy avy amin'ny fampiasana</li>
                <li>• Amin'ny fahaverezan'angon-drakitra na olana ara-teknika</li>
                <li>• Amin'ny tsy fahatokian'ny angon-drakitra na ny serivisy</li>
                <li>• Amin'ny fandraisan'ny mpampiasa ny angon-drakitra ho marina tanteraka</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Andraikitry ny mpampiasa</h4>
              <p>
                Ny mpampiasa dia tompon'andraikitra:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Amin'ny fomba fampiasana ity fampiharana ity</li>
                <li>• Amin'ny fitsiriana ny angon-drakitra alohan'ny fitokonana</li>
                <li>• Amin'ny fanarahana ny lalàna sy ny fitsipika ao amin'ny faritra misy azy</li>
                <li>• Amin'ny fiarovana ny angon-drakitra manokana</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Fananana ara-tsaina</CardTitle>
            <CardDescription>
              Fampahalalana momba ny zon'ny mpamorona sy ny loharano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Zon'ny angon-drakitra</h4>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Ny angon-drakitra Baiboly dia fananan'ny tompon'andraikitra avy</li>
                <li>• Ny kaody fampiharana dia azo ampiasaina araka ny lisansa MIT</li>
                <li>• Ny sary sy ny hevitra dia avy amin'ny loharano malalaka</li>
                <li>• Ny dikanteny Malagasy dia fananan'ny vondrom-piarahamonina</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Raha manana fanontaniana momba ny zon'ny mpamorona, 
              azafady mifandraisa amin'ny tompon'andraikitra avy.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Fanovana ity politika ity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ity politika momba ny fiainana manokana ity dia mety ovaina 
              amin'ny fotoana rehetra. Ny fiovana dia haseho eto amin'ity pejy ity 
              miaraka amin'ny daty nohavaozina.
            </p>
            <p className="text-muted-foreground">
              Ny fitohanana ampiasana ity fampiharana ity aorian'ny fanovana 
              dia midika ho fanekena ny politika vaovao.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Fifandraisana</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Raha manana fanontaniana momba ity politika momba ny fiainana manokana ity, 
              azafady mifandraisa aminay amin'ny alalan'ny pejy 
              <Link href="/about" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                "Momba anay"
              </Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
