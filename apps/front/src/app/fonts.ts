import localFont from "next/font/local";

export const firaCode = localFont({
	variable: "--font-fira-code",
	src: [
		{
			path: "../assets/fonts/FiraCode/FiraCode-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../assets/fonts/FiraCode/FiraCode-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "../assets/fonts/FiraCode/FiraCode-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../assets/fonts/FiraCode/FiraCode-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../assets/fonts/FiraCode/FiraCode-Light.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "../assets/fonts/FiraCode/FiraCode-Retina.ttf",
			weight: "600",
			style: "italic",
		},
	],
});

export const gilroy = localFont({
	variable: "--font-gilroy",
	// Only the weights/styles actually used across the app are active (see
	// font-normal/semibold/bold/extrabold/black usage, and italic on Logo.tsx)
	// — fewer font files means less transfer weight and fewer layout-shift-
	// prone swaps as each weight loads in. Unused entries are kept commented
	// out rather than deleted in case a future design needs them back.
	src: [
		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-UltraLight.ttf",
		// 	weight: "100",
		// 	style: "normal",
		// },
		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-UltraLightItalic.ttf",
		// 	weight: "100",
		// 	style: "italic",
		// },

		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-Light.ttf",
		// 	weight: "200",
		// 	style: "normal",
		// },
		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-LightItalic.ttf",
		// 	weight: "200",
		// 	style: "italic",
		// },

		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-Thin.ttf",
		// 	weight: "300",
		// 	style: "normal",
		// },
		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-ThinItalic.ttf",
		// 	weight: "300",
		// 	style: "italic",
		// },

		{
			path: "../assets/fonts/Gilroy/Gilroy-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../assets/fonts/Gilroy/Gilroy-RegularItalic.ttf",
			weight: "400",
			style: "italic",
		},

		// SemiBold was previously declared at weight "500", but Tailwind's
		// font-semibold class resolves to 600 — corrected here so the browser
		// actually matches this file instead of falling back/synthesizing bold.
		{
			path: "../assets/fonts/Gilroy/Gilroy-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-SemiBoldItalic.ttf",
		// 	weight: "600",
		// 	style: "italic",
		// },

		{
			path: "../assets/fonts/Gilroy/Gilroy-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-BoldItalic.ttf",
		// 	weight: "700",
		// 	style: "italic",
		// },

		{
			path: "../assets/fonts/Gilroy/Gilroy-ExtraBold.ttf",
			weight: "800",
			style: "normal",
		},
		// {
		// 	path: "../assets/fonts/Gilroy/Gilroy-ExtraBoldItalic.ttf",
		// 	weight: "800",
		// 	style: "italic",
		// },

		{
			path: "../assets/fonts/Gilroy/Gilroy-Heavy.ttf",
			weight: "900",
			style: "normal",
		},
		{
			path: "../assets/fonts/Gilroy/Gilroy-HeavyItalic.ttf",
			weight: "900",
			style: "italic",
		},
	],
});
