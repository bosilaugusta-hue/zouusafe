import CallToAction from "@/components/home/CallToAction";
import FeaturesSection from "@/components/home/FeaturesSection";
import HeroSection from "@/components/home/HeroSection";
import HomeFooter from "@/components/home/HomeFooter";
import HomeHeader from "@/components/home/HomeHeader";
import ParentPreview from "@/components/home/ParentPreview";
import StepsSection from "@/components/home/StepsSection";
export default function HomePage() {
	return (
		<main className="min-h-screen bg-[#f8f6ff]">
			<HomeHeader />
			<HeroSection />
			<FeaturesSection />
			<StepsSection />
			<ParentPreview />
			<CallToAction />
			<HomeFooter />
		</main>
	);
}
