import {
	characterisation,
	d6Weapons,
	femaleNames,
	galdrSpells,
	kits,
	maleNames,
	skills,
	twists
} from "./character-creator-tables.js";

class CharacterGenerator extends HTMLElement {
	connectedCallback() {
		// Inline SVG for a "copy" icon (Lucide-style)
		const COPY_SVG = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				focusable="false">
				<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
				<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
			</svg>
			`;

		// Render minimal UI
		this.innerHTML = `
			<div class="cg-toolbar">
				<button
					type="button"
					id="cg-generate"
					class="cg-button"
					aria-label="generate character"
					title="generate character">
					Generate character
				</button>
				<button
					type="button"
					id="cg-copy"
					class="cg-button"
					aria-label="copy to clipboard"
					title="copy to clipboard"
					style="display:inline-flex; align-items:center; gap:.35rem; padding:.35rem .6rem; border:1px solid var(--sl-color-gray-4,#ccc); border-radius:.4rem; background:rgb(107, 107, 107);">
					${COPY_SVG}
				</button>
			</div>
			<div id="cg-out" role="status" aria-live="polite"></div>
			`;

		// character info for copying
		let copyableCharacter = {};

		// helper fucntions
		const d6 = () => {
			return Math.floor(Math.random() * 6) + 1;
		};

		const chooseFrom = (table) => {
			return table[Math.floor(Math.random() * table.length)];
		};

		const generateName = () => {
			const { sex, forenames } =
				Math.random() > 0.5
					? { sex: "female", forenames: femaleNames }
					: { sex: "male", forenames: maleNames };

			const parentNames = sex === "female" ? femaleNames : maleNames;

			return `${chooseFrom(forenames)} ${chooseFrom(parentNames)}${
				sex === "female" ? "sdóttir" : "son"
			}`;
		};

		const generateAbilityScore = () => {
			const score = d6() + d6() + d6();
			return score;
		};

		const generateGift = () => {
			const gift = chooseFrom([
				"skill",
				"companion",
				"prophecy",
				"staves"
			]);
			switch (gift) {
				case "skill":
					return `Good (+2) at ${chooseFrom(skills)}`;
				case "companion":
					return chooseFrom([
						"intelligent raven",
						"thrall",
						"tracking hound",
						"loyal wolf"
					]);
				case "prophecy":
					return "prophecy";
				case "staves":
					return `staff of ${chooseFrom(
						galdrSpells
					)} & staff of ${chooseFrom(galdrSpells)}`;
			}
		};

		const generateGear = ({ guard }) => {
			const defaultGear = ["3 x trail ration (1 slot)", "1 torch"];
			let { name: kit, gift, reputation, gear } = chooseFrom(kits);
			gear = [...defaultGear, ...gear];

			let freebie;
			if (guard < 4) {
				freebie = gear.includes("helmet") ? "mail shirt" : "helmet";
			} else {
				do {
					freebie = chooseFrom(d6Weapons);
				} while (gear.includes(freebie));
			}
			gear.push(freebie);

			if (Math.random() < 0.3) gift = generateGift();

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
			return [physical, nonPhysical, hair];
		};

		const copyCharacter = () => {
			const c = copyableCharacter;
			const lines = [];

			lines.push(c.name);
			lines.push("");
			lines.push(`${c.kit} with a ${c.reputation} reputation`);
			lines.push(c.description.join("\n"));
			lines.push("");
			lines.push(`Might ${c.might} • Grace ${c.grace} • Will ${c.will}`);
			lines.push(`Guard ${c.guard} • Armour ${c.armour} • Deprived [ ]`);
			lines.push("");
			lines.push(`Gift: ${c.gift}`);
			lines.push(`Twist: ${c.twist}`);
			lines.push(`Silver: ${c.silver}`);
			lines.push("");
			lines.push(c.gear.join("\n"));

			const text = lines.join("\n");

			navigator.clipboard.writeText(text);
		};

		// generate character
		const generate = () => {
			const character = {};

			character.name = generateName();
			character.might = generateAbilityScore();
			character.grace = generateAbilityScore();
			character.will = generateAbilityScore();
			character.guard = d6();
			const coins =
				50 +
				(Math.max(character.might, character.grace, character.will) >=
				12
					? 0
					: (Math.floor(Math.random() * 10) +
							1 +
							(Math.floor(Math.random() * 10) + 1)) *
					  10);
			const coinageWeight = Math.floor(coins / 100);
			character.silver = `${coins} (${
				coinageWeight === 0
					? "weightless"
					: coinageWeight === 1
					? "1 slot"
					: `${coinageWeight} slots`
			})`;

			const { kit, gift, reputation, gear } = generateGear(character);
			character.kit = kit;
			character.gear = gear;
			character.reputation = reputation;
			character.gift = gift;
			character.twist = chooseFrom(twists);
			if (character.twist.includes("Poor (-1)"))
				character.reputation = "Poor (-1)";
			character.armour =
				(gear.includes("shield") ? 1 : 0) +
				(gear.includes("helmet") ? 1 : 0) +
				(gear.includes("mail shirt") ? 1 : 0) +
				(character.twist.includes("crab") ? 1 : 0);
			character.description = generateDescription();

			// register character for copying
			copyableCharacter = character;

			// display character
			buildAndDisplayHtml(character, character);
		};

		const buildAndDisplayHtml = ({
			name,
			description,
			kit,
			reputation,
			might,
			grace,
			will,
			armour,
			guard,
			silver,
			gear,
			twist,
			gift
		}) => {
			const html = `
				<h5>${name}</h5>
				<p><b>${kit}</b> with a <b>${reputation}</b> reputation</p>
				<p>${description.join("<br />")}</p>
				
				<table class="table-border">
					<tr>
						<td><h6>Might</h6></td>
						<td>${might}</td>
						<td><h6>Armour</h6></td>
						<td>${armour}</td>
					</tr>
					<tr>
						<td><h6>Grace</h6></td>
						<td>${grace}</td>
						<td><h6>Guard</h6></td>
						<td>${guard}</td>
					</tr>
					<tr>
						<td><h6>Will</h6></td>
						<td>${will}</td>
						<td><h6>Deprived</h6></td>
						<td><input type="checkbox" /></td>
					</tr>
				</table>
				<table class="table-border">
					<tr>
						<td><h6>Gift</h6></td>
						<td>${gift}</td>
					</tr>
					<tr>
						<td><h6>Twist</h6></td>
						<td>${twist}</td>
					</tr>
					<tr>
						<td><h6>Silver</h6></td>
						<td>${silver}</td>
					</tr>
				</table>
				<table class="table-border no-pad">
					<tr><td>${gear.join("</td></tr><tr><td>")}</td></tr>
				</table>
				`;

			const css = `
				<style>
					.cg-button {
						height: 35px;
						margin: 0;
						cursor: pointer;
					}
					.cg-toolbar {
						display: flex;
						gap: .5rem;
						align-items: center;
					}
					.table-border * {
						border-bottom: none;
					}
					.no-pad * {
						padding: 0;
					}
					
					.left-border {
						border-left: 1px solid var(--sl-color-gray-5);
						padding: 0;
					}
				</style>
			`;

			this.querySelector("#cg-out").innerHTML = html + css;
		};

		// Wire up behavior
		const genButton = this.querySelector("#cg-generate");
		genButton.addEventListener("click", generate);
		const cpyButton = this.querySelector("#cg-copy");
		cpyButton.addEventListener("click", copyCharacter);

		generate();
	}
}

// Register once
if (!customElements.get("character-generator")) {
	customElements.define("character-generator", CharacterGenerator);
}
