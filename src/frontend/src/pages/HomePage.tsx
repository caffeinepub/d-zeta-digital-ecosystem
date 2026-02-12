import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Leaf, MapPin, Users, Zap, Coffee, Mountain, TreePine, Home as HomeIcon } from 'lucide-react';
import HomeLiveCounters from '../components/home/HomeLiveCounters';

export default function HomePage() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/generated/dzeta-hero-bg.dim_1600x900.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-0" />
        
        <div className="container relative z-10 px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight">
              Where Heritage Meets the Future.
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-sans leading-relaxed">
              Nikmati kopi pilihan dari 5 kecamatan Taraju di hunian klasik 80-an. Didukung ekosistem digital cerdas untuk kenyamanan tanpa celah di ketinggian 1.000 MDPL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/menu' })}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 rounded-full shadow-lg"
              >
                <Coffee className="mr-2 h-5 w-5" />
                Pesan Sekarang & Pantau Antrean
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/museum' })}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold text-lg px-8 py-6 rounded-full backdrop-blur-sm"
              >
                <Mountain className="mr-2 h-5 w-5" />
                Jelajahi Sudut D'ZETA
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Digital Edge Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Bukan Sekadar Kafe, Tapi Pengalaman Digital.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Real-Time Queue Estimator</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Pantau status pesananmu secara presisi. Tak perlu lagi menunggu tanpa kepastian.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Coffee className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-xl">Digital Heritage Tales</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Setiap sudut punya cerita. Scan QR di artefak kami untuk mendengarkan narasi sejarah Taraju.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="font-serif text-xl">Smart Power Resilience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Operasional 24/7 tanpa gangguan listrik berkat sistem ATS & Genset terintegrasi.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Social & Eco Impact Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Berdaya Bersama Taraju.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Setiap cangkir yang Anda nikmati adalah dukungan langsung bagi petani lokal di 5 kecamatan. Melalui sistem Circular Economy, limbah organik D'ZETA diolah kembali menjadi pupuk untuk tanah Taraju.
            </p>
          </div>

          <HomeLiveCounters />

          <div className="mt-12 max-w-4xl mx-auto">
            <img
              src="/assets/generated/dzeta-origin-map.dim_1200x800.png"
              alt="Origin Map - 5 Kecamatan Taraju"
              className="w-full rounded-lg shadow-xl border-2 border-border"
            />
          </div>
        </div>
      </section>

      {/* Explore Our Space Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Temukan Zona Nyamanmu.
            </h2>
            <p className="text-muted-foreground text-lg">
              370 m² ruang yang dirancang untuk berbagai kebutuhan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Coffee className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Quiet Room</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Fokus maksimal untuk Deep Work.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <Mountain className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-serif text-xl">Rooftop Sanctuary</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Pemandangan kabut 1.000 MDPL.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-3">
                  <TreePine className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="font-serif text-xl">Mini Garden</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Ruang hangat untuk keluarga dan komunitas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <HomeIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Heritage Museum</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Galeri nostalgia di rumah kakek.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/booking' })}
              className="font-semibold px-8 py-6 rounded-full"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Booking Space Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-foreground/5 border-t py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img
                src="/assets/generated/dzeta-logo.dim_512x512.png"
                alt="D'ZETA Logo"
                className="h-16 w-16 object-contain"
              />
              <div className="text-left">
                <h3 className="font-serif text-2xl font-bold text-foreground">D'ZETA Space</h3>
                <p className="text-sm text-muted-foreground">Taraju</p>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm">
              A Strategic Partner of Taraju Village Sustainable Tourism.
            </p>

            <div className="pt-6 border-t space-y-2">
              <p className="text-sm text-muted-foreground">
                © {currentYear} D'ZETA Digital Ecosystem. Managed with Heart and Tech.
              </p>
              <p className="text-sm text-muted-foreground">
                Built with love using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.hostname : 'dzeta-digital-ecosystem'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
