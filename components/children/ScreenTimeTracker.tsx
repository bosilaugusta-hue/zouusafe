"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type ScreenTimeTrackerProps = {
	childId: number;
};

type ScreenTimeResponse = {
	limitReached?: boolean;
	screenTimeUsed?: number;
	screenTimeLimit?: number | null;
	message?: string;
};

const ONE_MINUTE = 60_000;
const ACTIVITY_DELAY = 60_000;

export default function ScreenTimeTracker({
	childId,
}: ScreenTimeTrackerProps) {
	const router = useRouter();
	const lastActivityRef = useRef(Date.now());

	useEffect(() => {
		function registerActivity() {
			lastActivityRef.current = Date.now();
		}

		const activityEvents = [
			"mousemove",
			"mousedown",
			"keydown",
			"touchstart",
			"scroll",
		];

		for (const eventName of activityEvents) {
			window.addEventListener(
				eventName,
				registerActivity,
				{ passive: true },
			);
		}

		const interval = window.setInterval(async () => {
			const pageIsVisible =
				document.visibilityState === "visible";

			const childIsActive =
				Date.now() - lastActivityRef.current <=
				ACTIVITY_DELAY;

			if (!pageIsVisible || !childIsActive) {
				return;
			}

			try {
				const response = await fetch(
					"/api/screen-time",
					{
						method: "POST",
						headers: {
							"Content-Type":
								"application/json",
						},
						body: JSON.stringify({
							childId,
						}),
					},
				);

				const data = (await response
	.json()
	.catch(() => ({}))) as ScreenTimeResponse;
				if (!response.ok) {
					console.error(
						data.message ??
							"Impossible de comptabiliser le temps d’écran.",
					);
					return;
				}

				if (data.limitReached) {
					router.refresh();
				}
			} catch (error) {
				console.error(
					"Erreur pendant le suivi du temps d’écran :",
					error,
				);
			}
		}, ONE_MINUTE);

		return () => {
			window.clearInterval(interval);

			for (const eventName of activityEvents) {
				window.removeEventListener(
					eventName,
					registerActivity,
				);
			}
		};
	}, [childId, router]);

	return null;
}