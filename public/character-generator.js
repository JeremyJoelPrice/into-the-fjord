import {
	characterisation,
	d6Weapons,
	femaleNames,
	galdrSpells,
	kits,
	maleNames,
	skills,
	twists
} from "../src/components/data/character-creator-tables";

class CharacterGenerator extends HTMLElement {
	connectedCallback() {
		// Render minimal UI
		this.innerHTML = `
			<button type="button" id="cg-generate">Generate character</button>
			<div id="cg-out" role="status" aria-live="polite"></div>
    	`;

		/* helper fucntions */

		const d6 = () => {
			return Math.floor(Math.random() * 6) + 1;
		};

		const chooseFrom = (table) => {
			return table[Math.floor(Math.random() * table.length)];
		};

		const generateAbilityScore = () => {
			const score = d6() + d6() + d6();
			return score;
		};

		// const generateGift = () => {
		// 	const gift = chooseFrom([
		// 		"skill",
		// 		"companion",
		// 		"prophecy",
		// 		"staves"
		// 	]);
		// 	switch (gift) {
		// 		case "skill":
		// 			return `Good (+2) at ${chooseFrom(skills)}`;
		// 		case "companion":
		// 			return chooseFrom([
		// 				"intelligent raven",
		// 				"thrall",
		// 				"tracking hound",
		// 				"loyal wolf"
		// 			]);
		// 		case "prophecy":
		// 			return "prophecy";
		// 		case "staves":
		// 			return `staff of ${chooseFrom(
		// 				galdrSpells
		// 			)} & staff of ${chooseFrom(galdrSpells)}`;
		// 	}
		// };

		const generateGear = ({ guard }) => {
			const defaultGear = ["3 x trail ration (1 slot)", "1 torch"];
			let { name: kit, gift, reputation, gear } = chooseFrom(kits);
			gear = [...defaultGear, ...gear];

			let freebie;
			if (guard < 4) {
				freebie = gear.includes("shield") ? "mail shirt" : "shield";
			} else {
				do {
					freebie = chooseFrom(d6Weapons);
				} while (gear.includes(freebie));
			}
			gear.push(freebie);

			return { kit, gift, reputation, gear };
		};

		const generateDescription = () => {
			const physical = chooseFrom(
				characterisation.physicalCharacterisation
			);
			const nonPhysical = chooseFrom(
				characterisation.nonphysicalCharacterisation
			);
			const hair = chooseFrom(characterisation.hairCharacterisation);
			return `${physical}\n${nonPhysical}\n${hair}`;
		};

		// generate character
		const generate = () => {
			const names = Math.random() > 0.5 ? femaleNames : maleNames;
			const newChar = {};
			newChar.name = chooseFrom(names);

			newChar.might = generateAbilityScore();
			newChar.grace = generateAbilityScore();
			newChar.will = generateAbilityScore();
			newChar.guard = d6();
			newChar.silver =
				50 +
				(Math.max(newChar.might, newChar.grace, newChar.will) >= 12
					? 0
					: (Math.floor(Math.random() * 10) +
							1 +
							(Math.floor(Math.random() * 10) + 1)) *
					  10);

			const { kit, gift, reputation, gear } = generateGear(newChar);
			newChar.kit = kit;
			newChar.gear = gear;
			newChar.reputation = reputation;
			newChar.gift = gift;
			newChar.twist = chooseFrom(twists);

			newChar.description = generateDescription();

			// display character
			const characterText =
				this.querySelector("#cg-out").innerHTML + " cheese";
			this.querySelector("#cg-out").innerHTML = JSON.stringify(
				newChar
			).replaceAll(",", "<br />");
		};

		// Wire up behavior
		const btn = this.querySelector("#cg-generate");
		btn.addEventListener("click", generate);

		generate();
	}
}

// Register once
if (!customElements.get("character-generator")) {
	customElements.define("character-generator", CharacterGenerator);
}
