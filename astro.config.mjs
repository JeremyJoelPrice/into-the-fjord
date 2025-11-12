// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Home",
			pagination: false,
			customCss: ["/src/styles/custom.css"],
			sidebar: [
				{
					// start here
					label: "Start Here",
					items: [
						{
							label: "Introduction",
							slug: "start-here/introduction"
						},
						{
							label: "How To Play",
							slug: "start-here/how-to-play"
						},
						{
							label: "Example Of Play",
							slug: "start-here/example-of-play"
						},
						{
							label: "Philosophy & Playstyle",
							slug: "start-here/philosophy"
						}
					]
				},
				{
					// character creation
					label: "Character Creation",
					items: [
						{
							label: "How To Create A Character",
							slug: "character-creation/how-to-create-a-character"
						},
						{
							label: "Kits",
							slug: "character-creation/kits"
						},
						{
							label: "Gear Tables",
							slug: "character-creation/gear-tables"
						}
					]
				},
				{
					// the rules
					label: "The Rules",
					items: [
						{
							label: "Ability Scores",
							slug: "rules/ability-scores"
						},
						{
							label: "Carrying Gear",
							slug: "rules/carrying-gear"
						},
						{
							label: "Fatigue",
							slug: "rules/fatigue"
						},
						{
							label: "Deprivation",
							slug: "rules/deprivation"
						},
						{
							label: "Resting & Healing",
							slug: "rules/resting-and-healing"
						},
						{
							label: "Reputation",
							slug: "rules/reputation"
						},
						{ label: "Skills", slug: "rules/skills" },
						{
							label: "Fighting",
							items: [
								{
									label: "Turns & Actions",
									slug: "rules/fighting/turns-and-actions"
								},
								{
									label: "Attacks & Damage",
									slug: "rules/fighting/attacks-and-damage"
								},
								{
									label: "Armour & Shields",
									slug: "rules/fighting/armour-and-shields"
								},
								{
									label: "Guard",
									slug: "rules/fighting/guard"
								},
								{
									label: "Wounds",
									slug: "rules/fighting/wounds"
								},
								{
									label: "Units",
									slug: "rules/fighting/units"
								}
							]
						},
						{
							label: "Magic",
							items: [
								{
									label: "Galdr Spell List",
									slug: "rules/magic/galdr-spell-list"
								},
								{
									label: "Galdr",
									slug: "rules/magic/galdr"
								},
								{
									label: "Seiðr",
									slug: "rules/magic/seiðr"
								},
								{
									label: "Dwarven Relics",
									slug: "rules/magic/dwarven-relics"
								}
							]
						}
					]
				},
				{
					// setting
					label: "Setting",
					items: [
						{
							label: "Introduction",
							slug: "setting/introduction"
						},
						{
							label: "Norðland In Detail",
							slug: "setting/norðland-in-detail"
						},
						{ label: "Creatures", slug: "setting/creatures" }
					]
				}
			]
		})
	]
});
