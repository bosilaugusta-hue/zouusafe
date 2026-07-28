export function getChildAssets(avatarUrl: string) {
	const fileName =
		avatarUrl.split("/").pop()?.replace(".png", "") ?? "fille-15";

	return {
		profile: `/avatars-profil/${fileName}.png`,
		tablet: `/enfants/${fileName}-tablette.png`,
		search: `/enfants/${fileName}-loupe.png`,
	};
}
