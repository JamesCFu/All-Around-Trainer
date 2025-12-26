
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { generateGrammarLesson, generateSpellingTest } from '../geminiService';
import { VocabularyWord, GrammarLesson, Question, RootWord, Category } from '../types';

const GRAMMAR_TOPICS = [
  "Comma Mastery: Essential vs Non-Essential",
  "Semicolons, Colons, and Dashes",
  "Modifier Placement (Dangling/Misplaced)",
  "Subject-Verb Agreement Pitfalls",
  "Parallel Structure in Lists",
  "Active vs Passive Voice Strategies",
  "Pronoun Case and Agreement",
  "Verb Tense Consistency",
  "Sentence Combining and Flow",
  "Transition Words and Rhetorical Purpose",
  "Commonly Confused Words (Academic)",
  "Capitalization and Punctuation Nuance"
];

// Exhaustive Root Data from A-Z
const ROOT_DATA: RootWord[] = [
  { root: "a/n", meaning: "not, without", examples: ["abyss", "achromatic", "anhydrous"] },
  { root: "a", meaning: "on", examples: ["afire", "ashore", "aside"] },
  { root: "ab/s", meaning: "from, away, off", examples: ["abduct", "abnormal", "absent", "aversion"] },
  { root: "a/c/d", meaning: "to, toward, near", examples: ["accelerate", "accessible", "admittance"] },
  { root: "acro", meaning: "top, height, tip, beginning", examples: ["acrobat", "acronym", "acrophobia"] },
  { root: "act", meaning: "do", examples: ["activity", "react", "interaction"] },
  { root: "aer/o", meaning: "air", examples: ["aerate", "aerial", "aerospace"] },
  { root: "agr/i/o", meaning: "farming", examples: ["agriculture", "agribusiness", "agrarian"] },
  { root: "alg/o", meaning: "pain", examples: ["neuralgia", "analgesic", "nostalgia"] },
  { root: "ambi/amphi", meaning: "both, on both sides, around", examples: ["ambidextrous", "ambiguous", "ambivalence"] },
  { root: "ambul", meaning: "walk, move", examples: ["amble", "ambulant", "ambulance"] },
  { root: "ami/o", meaning: "love", examples: ["amiable", "amity", "amorous"] },
  { root: "ana", meaning: "up, back, against, again, throughout", examples: ["analysis", "anatomy", "anachronism"] },
  { root: "andr/o", meaning: "man, male", examples: ["androgynous", "android", "misandry"] },
  { root: "anim", meaning: "life, spirit", examples: ["animal", "animate", "equanimity"] },
  { root: "ann/enn", meaning: "year", examples: ["anniversary", "annual", "millennium"] },
  { root: "ante", meaning: "before, in front", examples: ["antecede", "antemeridian", "anteroom"] },
  { root: "anth/o", meaning: "flower", examples: ["chrysanthemum", "anthology", "anthozoan"] },
  { root: "anthrop/o", meaning: "human", examples: ["anthropology", "philanthropy"] },
  { root: "anti", meaning: "against, opposite of", examples: ["antibody", "antiseptic", "antisocial"] },
  { root: "apo/apho", meaning: "away, off, separate", examples: ["aphorism", "apology", "apostrophe"] },
  { root: "aqu/a", meaning: "water", examples: ["aquarium", "aquatic", "aqueduct"] },
  { root: "arbor", meaning: "tree", examples: ["arborist", "arborous"] },
  { root: "arch/i", meaning: "chief, rule, most important", examples: ["archbishop", "monarch", "matriarch"] },
  { root: "astro/aster", meaning: "star, stars, outer space", examples: ["astronaut", "astronomer", "asterisk"] },
  { root: "aud/i/io", meaning: "hear", examples: ["audible", "audience", "audiovisual"] },
  { root: "auto", meaning: "self, same, one", examples: ["autocrat", "autograph", "automatic"] },
  { root: "avi/a", meaning: "bird", examples: ["aviary", "aviation", "aviatrix"] },
  { root: "bar/o", meaning: "pressure, weight", examples: ["baric", "milliard", "baryon"] },
  { root: "bell/i", meaning: "war", examples: ["bellicose", "belligerent", "rebel"] },
  { root: "bene", meaning: "good, well", examples: ["benefactor", "beneficial", "benevolent"] },
  { root: "bi/n", meaning: "two, twice, once in every two", examples: ["biannual", "binoculars", "bilateral"] },
  { root: "bio", meaning: "life, living matter", examples: ["biography", "biology", "biosphere"] },
  { root: "blast/o", meaning: "cell, primitive, immature cell", examples: ["blastula", "fibroblast", "blastoderm"] },
  { root: "burs", meaning: "pouch, purse", examples: ["bursar", "bursary", "disburse"] },
  { root: "calc", meaning: "stone", examples: ["calcite", "calcium", "calcification"] },
  { root: "cand", meaning: "glowing, iridescent", examples: ["candid", "candle", "incandescent"] },
  { root: "capt/cept/ceive", meaning: "take, hold", examples: ["intercept", "perceive", "captivate"] },
  { root: "cardi/o", meaning: "heart", examples: ["cardiac", "cardiogenic", "cardiologist"] },
  { root: "carn/i", meaning: "flesh, meat", examples: ["carnivorous", "carnal", "incarnate"] },
  { root: "cata", meaning: "down, against, completely", examples: ["cataclysm", "catalog", "catastrophe"] },
  { root: "caust/caut", meaning: "to burn", examples: ["cauterize", "caustic", "holocaust"] },
  { root: "cede/ceed/cess", meaning: "go, yield", examples: ["exceed", "recede", "access"] },
  { root: "celer", meaning: "fast", examples: ["accelerate", "decelerate"] },
  { root: "cent/i", meaning: "hundred, hundredth", examples: ["centennial", "centimeter", "century"] },
  { root: "centr/o/i", meaning: "center", examples: ["egocentric", "eccentric", "centrifugal"] },
  { root: "cephal/o", meaning: "head", examples: ["encephalitis", "cephalic", "cephalopod"] },
  { root: "cerebr/o", meaning: "brain", examples: ["cerebral", "cerebrate", "cerebrospinal"] },
  { root: "cert", meaning: "sure", examples: ["ascertain", "certain", "certify"] },
  { root: "chrom", meaning: "color, pigment", examples: ["achromatic", "chromium", "chromatics"] },
  { root: "chron/o", meaning: "time", examples: ["chronic", "chronology", "synchronize"] },
  { root: "chrys", meaning: "gold, yellow", examples: ["chrysanthemum", "chrysolite"] },
  { root: "cide/cise", meaning: "cut, kill", examples: ["homicide", "incisor", "insecticide"] },
  { root: "circum", meaning: "around, about", examples: ["circumnavigate", "circumscribe", "circumspect"] },
  { root: "claim/clam", meaning: "shout, speak out", examples: ["clamor", "exclaim", "proclamation"] },
  { root: "clar", meaning: "clear", examples: ["clarification", "clarify", "declare"] },
  { root: "clud/clus", meaning: "close", examples: ["conclusion", "exclusion", "seclude"] },
  { root: "cline", meaning: "lean", examples: ["inclination", "incline", "recline"] },
  { root: "co/con", meaning: "with, together", examples: ["coauthor", "collaborate", "commemorate", "concur"] },
  { root: "cogn/i", meaning: "know", examples: ["cognition", "incognito", "recognize"] },
  { root: "contra/o", meaning: "against, opposite", examples: ["contradict", "contraflow", "controversy"] },
  { root: "corp/o", meaning: "body", examples: ["corporation", "corpse", "corporal"] },
  { root: "cosm/o", meaning: "universe", examples: ["cosmonaut", "cosmos", "microcosm"] },
  { root: "counter", meaning: "opposite, contrary", examples: ["counteract", "countermand", "counteroffensive"] },
  { root: "cranio", meaning: "skull", examples: ["craniology", "cranium", "cranial"] },
  { root: "cred", meaning: "believe", examples: ["credence", "credulous", "incredible"] },
  { root: "cruc", meaning: "cross", examples: ["crucial", "crucifix", "excruciating"] },
  { root: "crypto", meaning: "hidden, secret", examples: ["cryptic", "cryptography", "encrypt"] },
  { root: "cumul", meaning: "mass, heap", examples: ["accumulate", "cumulative"] },
  { root: "curr/curs", meaning: "run", examples: ["concurrent", "current", "cursive"] },
  { root: "cycl", meaning: "circle, ring", examples: ["bicycle", "cycle", "cyclone"] },
  { root: "de", meaning: "reduce, away, down", examples: ["decelerate", "dethrone", "debug"] },
  { root: "dec/a/deka", meaning: "ten", examples: ["decade", "decathlon", "December"] },
  { root: "deci", meaning: "one tenth", examples: ["deciliter", "decimate", "decibel"] },
  { root: "dem/o", meaning: "people", examples: ["democracy", "demographic", "epidemic"] },
  { root: "demi", meaning: "half, less than", examples: ["demitasse", "demimonde"] },
  { root: "dendr/o/i", meaning: "tree", examples: ["philodendron", "dendrochronology", "dendriform"] },
  { root: "dent/dont", meaning: "tooth", examples: ["dental", "dentist", "dentures"] },
  { root: "derm/a", meaning: "skin", examples: ["dermatologist", "pachyderm", "dermatitis"] },
  { root: "di/plo", meaning: "two, twice", examples: ["dichromatic", "diploma", "dilemma"] },
  { root: "di/s", meaning: "apart, away, not", examples: ["digression", "disappear", "dissect"] },
  { root: "dia", meaning: "through, between, apart, across", examples: ["diabetes", "diagnosis", "dialog"] },
  { root: "dict", meaning: "speak", examples: ["contradict", "prediction", "dictate"] },
  { root: "domin", meaning: "master", examples: ["dominate", "domineering", "predominate"] },
  { root: "don/at", meaning: "give", examples: ["donation", "donor", "pardon"] },
  { root: "duc/t", meaning: "lead", examples: ["conduct", "educate", "deduction"] },
  { root: "du/o", meaning: "two, twice", examples: ["duplicate", "duet", "duo"] },
  { root: "dur", meaning: "harden, to last, lasting", examples: ["durable", "duration", "enduring"] },
  { root: "dyn/a/am", meaning: "power, energy, strength", examples: ["dynamo", "dynamic", "dynamite"] },
  { root: "dys", meaning: "abnormal, bad", examples: ["dyspepsia", "dystopia", "dyslexia"] },
  { root: "e", meaning: "out, away", examples: ["eloquent", "emissary", "eject"] },
  { root: "ego", meaning: "self", examples: ["egoistic", "alter ego", "egomania"] },
  { root: "em/en", meaning: "into, cover with, cause", examples: ["empathy", "empower", "engorge"] },
  { root: "endo", meaning: "within, inside", examples: ["endotherm", "endocrine", "endogamy"] },
  { root: "enn/anni", meaning: "years", examples: ["bicentennial", "centennial", "perennial"] },
  { root: "ep/i", meaning: "on, upon, over, among, after", examples: ["epidemic", "epilogue", "epicenter"] },
  { root: "equ/i", meaning: "equal, equally", examples: ["equidistant", "equanimity", "equation"] },
  { root: "erg/o", meaning: "work", examples: ["ergonomics", "energy", "energetics"] },
  { root: "esth/aesth", meaning: "feeling, sensation, beauty", examples: ["esthetician", "aesthetic", "kinesthesia"] },
  { root: "ethno", meaning: "race, people", examples: ["ethnic", "ethnocentric", "ethnology"] },
  { root: "eu", meaning: "good, well", examples: ["euphemism", "euphonious", "euphoria"] },
  { root: "ex", meaning: "from, out", examples: ["excavate", "exhale", "extract"] },
  { root: "extra/extro", meaning: "outside, beyond", examples: ["extraordinary", "extraterrestrial", "extrovert"] },
  { root: "fac/t", meaning: "make, do", examples: ["artifact", "factory", "malefact"] },
  { root: "fer", meaning: "bear, bring, carry", examples: ["confer", "ferry", "transfer"] },
  { root: "fid", meaning: "faith", examples: ["confide", "fidelity", "fiduciary"] },
  { root: "flect", meaning: "bend", examples: ["deflect", "inflection", "flexible"] },
  { root: "flor", meaning: "flower", examples: ["florist", "floral", "flora"] },
  { root: "for", meaning: "completely, forsaken", examples: ["forsaken", "forfeited", "forgiven"] },
  { root: "fore", meaning: "in front of, previous", examples: ["forebear", "forebode", "forecast"] },
  { root: "form", meaning: "shape", examples: ["conformity", "formation", "reformatory"] },
  { root: "fract/frag", meaning: "break", examples: ["fracture", "fragile", "fragment"] },
  { root: "fug", meaning: "flee, run away, escape", examples: ["fugitive", "refuge", "refugee"] },
  { root: "funct", meaning: "perform, work", examples: ["defunct", "function", "malfunction"] },
  { root: "fus", meaning: "pour", examples: ["confusion", "fuse", "infuse"] },
  { root: "gastr/o", meaning: "stomach", examples: ["gastric", "gastronomy", "gastritis"] },
  { root: "gen/o/e/genesis", meaning: "birth, production, formation", examples: ["genealogy", "generation", "genetic"] },
  { root: "geo", meaning: "earth, soil, global", examples: ["geography", "geology", "geoponics"] },
  { root: "ger", meaning: "old age", examples: ["geriatrics", "gerontocracy", "gerontology"] },
  { root: "giga", meaning: "a billion", examples: ["gigabyte", "gigahertz", "gigawatt"] },
  { root: "gon", meaning: "angle", examples: ["decagon", "diagonal", "octagon"] },
  { root: "gram", meaning: "letter, written", examples: ["diagram", "grammar", "telegram"] },
  { root: "gran", meaning: "grain", examples: ["granary", "granola", "granule"] },
  { root: "graph/y", meaning: "writing, recording", examples: ["graphology", "autograph", "seismograph"] },
  { root: "grat", meaning: "pleasing", examples: ["gratify", "grateful", "gratuity"] },
  { root: "gyn/o/e", meaning: "woman, female", examples: ["gynecology", "gynephobia", "gynecoid"] },
  { root: "gress/grad/e/i", meaning: "to step, to go", examples: ["digression", "progress", "gradual"] },
  { root: "hect/o", meaning: "hundred", examples: ["hectoliter", "hectare", "hectometer"] },
  { root: "helic/o", meaning: "spiral, circular", examples: ["helicopter", "helix", "helicon"] },
  { root: "heli/o", meaning: "sun", examples: ["heliotropism", "heliograph", "helianthus"] },
  { root: "hemi", meaning: "half, partial", examples: ["hemicycle", "hemisphere", "hemistich"] },
  { root: "hem/o/a", meaning: "blood", examples: ["hemorrhage", "hemorrhoids", "hemoglobin"] },
  { root: "hepa", meaning: "liver", examples: ["hepatitis", "hepatoma", "hepatotoxic"] },
  { root: "hept/a", meaning: "seven", examples: ["heptagon", "Heptateuch", "heptameter"] },
  { root: "herbi", meaning: "grass, plant", examples: ["herbicide", "herbivorous", "herbal"] },
  { root: "hetero", meaning: "different, other", examples: ["heterogeneous", "heteronym", "heterodox"] },
  { root: "hex/a", meaning: "six", examples: ["hexagon", "hexameter", "hexapod"] },
  { root: "histo", meaning: "tissue", examples: ["histology", "histochemistry"] },
  { root: "homo/homeo", meaning: "like, alike, same", examples: ["homogeneous", "homonym", "homeopath"] },
  { root: "hydr/o", meaning: "liquid, water", examples: ["hydrate", "hydrophobia", "hydroponics"] },
  { root: "hygr/o", meaning: "moisture, humidity", examples: ["hygrometer", "hygrograph"] },
  { root: "hyper", meaning: "too much, over, excessive", examples: ["hyperactive", "hypercritical", "hypertension"] },
  { root: "hyp/o", meaning: "under", examples: ["hypoglycemia", "hypothermia", "hypothesis"] },
  { root: "iatr/o", meaning: "medical care", examples: ["geriatrics", "pediatrician", "podiatry"] },
  { root: "icon/o", meaning: "image", examples: ["icon", "iconology", "iconoclast"] },
  { root: "idio", meaning: "peculiar, personal, distinct", examples: ["idiomatic", "idiosyncrasy", "idiot"] },
  { root: "il/in", meaning: "in, into", examples: ["illuminate", "innovation", "inspection"] },
  { root: "ig/il/im/in/ir", meaning: "not, without", examples: ["illegal", "impossible", "inappropriate", "irresponsible"] },
  { root: "imag", meaning: "likeness", examples: ["image", "imaginative", "imagine"] },
  { root: "infra", meaning: "beneath, below", examples: ["infrastructure", "infrared"] },
  { root: "inter", meaning: "between, among, jointly", examples: ["international", "intersection", "intercept"] },
  { root: "intra/intro", meaning: "within, inside", examples: ["intrastate", "intravenous", "introvert"] },
  { root: "ir", meaning: "not", examples: ["irredeemable", "irreformable", "irrational"] },
  { root: "iso", meaning: "equal", examples: ["isobar", "isometric", "isothermal"] },
  { root: "ject", meaning: "throw", examples: ["eject", "interject", "project"] },
  { root: "jud", meaning: "law", examples: ["judgment", "judicial", "judiciary"] },
  { root: "junct", meaning: "join", examples: ["conjunction", "disjunction", "junction"] },
  { root: "juven", meaning: "young", examples: ["juvenile", "rejuvenate"] },
  { root: "kilo", meaning: "thousand", examples: ["kilobyte", "kilometer", "kilogram"] },
  { root: "kine/t/mat", meaning: "motion, division", examples: ["kinetics", "telekinesis", "cinematography"] },
  { root: "lab", meaning: "work", examples: ["collaborate", "elaborate", "laborious"] },
  { root: "lact/o", meaning: "milk", examples: ["lactate", "lactose", "lactic acid"] },
  { root: "later", meaning: "side", examples: ["bilateral", "unilateral"] },
  { root: "leuk/o/leuc/o", meaning: "white, colorless", examples: ["leukemia", "leukocyte", "leucine"] },
  { root: "lex", meaning: "word, law, reading", examples: ["lexicology", "alexia"] },
  { root: "liber", meaning: "free", examples: ["liberate", "libertine", "liberty"] },
  { root: "lingu", meaning: "language, tongue", examples: ["linguist", "multilingual", "linguine"] },
  { root: "lip/o", meaning: "fat", examples: ["liposuction", "lipase", "lipoid"] },
  { root: "lite/ite/lith/o", meaning: "mineral, rock, fossil", examples: ["apatite", "granite", "monolith"] },
  { root: "loc", meaning: "place", examples: ["dislocate", "location", "relocate"] },
  { root: "log/o", meaning: "word, doctrine, discourse", examples: ["logic", "monologue", "analogy"] },
  { root: "loqu/locu", meaning: "speak", examples: ["eloquent", "loquacious", "elocution"] },
  { root: "luc", meaning: "light", examples: ["elucidate", "lucid", "translucent"] },
  { root: "lud/lus", meaning: "to play", examples: ["prelude", "illusion", "delude"] },
  { root: "lumin", meaning: "light", examples: ["illuminate", "lumen"] },
  { root: "lun/a/i", meaning: "moon", examples: ["lunar", "lunarscape", "lunatic"] },
  { root: "macro", meaning: "large, great", examples: ["macroevolution", "macromolecule", "macroeconomics"] },
  { root: "magn/a/i", meaning: "great, large", examples: ["magnify", "magnificent", "magnate"] },
  { root: "mal/e", meaning: "bad, ill, wrong", examples: ["malcontent", "malaria", "malicious"] },
  { root: "man/i/u", meaning: "hand", examples: ["maneuver", "manual", "manuscript"] },
  { root: "mand", meaning: "to order", examples: ["command", "demand", "mandate"] },
  { root: "mania", meaning: "madness, insanity", examples: ["bibliomania", "egomania", "maniac"] },
  { root: "mar/i", meaning: "sea", examples: ["marina", "maritime", "submarine"] },
  { root: "mater/matr/i", meaning: "mother", examples: ["maternal", "maternity", "matriarch"] },
  { root: "max", meaning: "greatest", examples: ["maximal", "maximize", "maximum"] },
  { root: "medi", meaning: "middle", examples: ["medieval", "medium", "mediocre"] },
  { root: "mega", meaning: "great, large, million", examples: ["megalopolis", "megaphone", "megastructure"] },
  { root: "melan/o", meaning: "black", examples: ["melancholy", "melanoma", "melodrama"] },
  { root: "memor/i", meaning: "remember", examples: ["commemorate", "memorial", "memory"] },
  { root: "merge/mers", meaning: "dip, dive", examples: ["immerge", "immerse", "submerge"] },
  { root: "meso", meaning: "middle", examples: ["Mesoamerica", "meson"] },
  { root: "meta", meaning: "change, after, beyond", examples: ["metaphysics", "metamorphosis", "metastasis"] },
  { root: "meter/metr/y", meaning: "measure", examples: ["audiometer", "chronometer", "metric"] },
  { root: "micro", meaning: "very small, short, minute", examples: ["microbe", "microchip", "microscope"] },
  { root: "mid", meaning: "middle", examples: ["midriff", "midterm", "midway"] },
  { root: "migr", meaning: "move", examples: ["immigrant", "migrant", "migration"] },
  { root: "milli", meaning: "onethousandth", examples: ["millimeter", "millibar", "milliliter"] },
  { root: "min/i", meaning: "small, less", examples: ["mini", "minuscule", "minutiae"] },
  { root: "mis/o", meaning: "bad, badly, wrongly, hate", examples: ["misbehave", "misprint", "misnomer"] },
  { root: "miss/mit", meaning: "send, let go", examples: ["dismiss", "missile", "emit"] },
  { root: "mob", meaning: "move", examples: ["immobilize", "mobile", "mobility"] },
  { root: "mon/o", meaning: "one, single, alone", examples: ["monochromat", "monologue", "monotheism"] },
  { root: "mot/mov", meaning: "move", examples: ["motion", "motivate", "promote"] },
  { root: "morph/o", meaning: "form", examples: ["metamorphosis", "endorphins", "amorphous"] },
  { root: "mort", meaning: "death", examples: ["immortal", "mortal", "mortician"] },
  { root: "multi", meaning: "many, more than one", examples: ["multicolored", "multimedia", "multitasking"] },
  { root: "mut", meaning: "change", examples: ["immutable", "mutant", "mutate"] },
  { root: "my/o", meaning: "muscle", examples: ["myocardium", "myasthenia", "myosin"] },
  { root: "narr", meaning: "tell", examples: ["narrate", "narrative", "narrator"] },
  { root: "nat", meaning: "born", examples: ["innate", "natal", "natural"] },
  { root: "nav", meaning: "ship", examples: ["circumnavigate", "naval", "navigate"] },
  { root: "necr/o", meaning: "dead, death", examples: ["necrophil", "necrosis", "necrology"] },
  { root: "neg", meaning: "no", examples: ["negate", "negative", "renege"] },
  { root: "neo", meaning: "new, recent", examples: ["neoclassic", "neocolonialism", "neonatal"] },
  { root: "nephr/o", meaning: "kidney", examples: ["nephritis", "nephrotomy", "nephron"] },
  { root: "neur/o", meaning: "nerve", examples: ["neuralgia", "neurologist", "neurotic"] },
  { root: "nom/in", meaning: "name", examples: ["misnomer", "nominal", "nominate"] },
  { root: "non", meaning: "no, not, without", examples: ["nondescript", "nonfiction", "nonsense"] },
  { root: "not", meaning: "mark", examples: ["notable", "notarize", "annotate"] },
  { root: "noun/nunc", meaning: "declare", examples: ["announce", "denounce", "enunciate"] },
  { root: "nov", meaning: "new", examples: ["innovate", "novelty", "novice"] },
  { root: "numer", meaning: "number", examples: ["enumerate", "numerology", "numerous"] },
  { root: "ob/op", meaning: "in the way, against", examples: ["object", "obscure", "opposition"] },
  { root: "oct/a/o", meaning: "eight", examples: ["octagon", "octogenarian", "octopus"] },
  { root: "ocu", meaning: "eye", examples: ["binoculars", "monocula", "oculist"] },
  { root: "od", meaning: "path, way", examples: ["diode", "odometer", "triode"] },
  { root: "odor", meaning: "smell, scent", examples: ["deodorant", "malodorous", "odoriferous"] },
  { root: "omni", meaning: "all", examples: ["omnipotent", "omniscient", "omnivorous"] },
  { root: "op/t/s", meaning: "eye, visual, sight", examples: ["optic", "optician", "autopsy"] },
  { root: "opt", meaning: "best", examples: ["optimal", "optimize", "optimum"] },
  { root: "ortho", meaning: "straight", examples: ["orthodontist", "orthopedic", "orthography"] },
  { root: "osteo", meaning: "bone", examples: ["osteoarthritis", "osteopathy", "osteology"] },
  { root: "out", meaning: "goes beyond, exceeds", examples: ["outgoing", "outdoing", "outdoor"] },
  { root: "over", meaning: "excessive", examples: ["overconfident", "overstock", "overexcited"] },
  { root: "oxi/oxy", meaning: "sharp", examples: ["oxymoron", "oxidize"] },
  { root: "pale/o", meaning: "ancient", examples: ["paleontology", "paleography", "Paleolithic"] },
  { root: "pan", meaning: "all, any, everyone", examples: ["panacea", "panorama", "pantheism"] },
  { root: "para", meaning: "beside, beyond, abnormal", examples: ["parasite", "parallel", "paragraph"] },
  { root: "pater/patr/i", meaning: "father", examples: ["paternal", "paternity", "patriarch"] },
  { root: "path", meaning: "feeling, emotion", examples: ["antipathy", "apathy", "empathy"] },
  { root: "ped/i/e", meaning: "foot, feet", examples: ["pedal", "pedestrian", "pedicure"] },
  { root: "pel", meaning: "drive, force", examples: ["compel", "expel", "repel"] },
  { root: "pent/a", meaning: "five", examples: ["pentagon", "pentagram", "pentathlon"] },
  { root: "pept/peps", meaning: "digestion", examples: ["dyspepsia", "peptic", "pepsin"] },
  { root: "per", meaning: "through, throughout", examples: ["permanent", "permeate", "persist"] },
  { root: "peri", meaning: "around, enclosing", examples: ["periodontal", "peripheral", "perimeter"] },
  { root: "phag/e", meaning: "to eat", examples: ["esophagus", "anthropophagy", "xylophagous"] },
  { root: "phil/o", meaning: "love, friend", examples: ["philanthropist", "philology", "philosophy"] },
  { root: "phon/o/e/y", meaning: "sound", examples: ["cacophony", "microphone", "phonetic"] },
  { root: "phot/o", meaning: "light", examples: ["photogenic", "photograph", "photon"] },
  { root: "phyll/o", meaning: "leaf", examples: ["chlorophyll", "phyllotaxis", "phyllite"] },
  { root: "phys", meaning: "nature, medicine, body", examples: ["physical", "physician", "physique"] },
  { root: "phyt/o/e", meaning: "plant, to grow", examples: ["epiphyte", "hydrophyte", "neophyte"] },
  { root: "plas/t/m", meaning: "to form, development", examples: ["protoplasm", "plastic", "plaster"] },
  { root: "plaud/plod/plaus/plos", meaning: "approve, clap", examples: ["applaud", "explosion", "plausible"] },
  { root: "pneum/o", meaning: "breathing, lung, spirit", examples: ["pneumonia", "pneumatic", "dyspnea"] },
  { root: "pod/e", meaning: "foot", examples: ["podiatrist", "podium", "tripod"] },
  { root: "poli", meaning: "city", examples: ["metropolis", "police", "politics"] },
  { root: "poly", meaning: "many, more than one", examples: ["polychrome", "polyglot", "polygon"] },
  { root: "pon", meaning: "place, put", examples: ["opponent", "postpone"] },
  { root: "pop", meaning: "people", examples: ["popular", "population", "populist"] },
  { root: "port", meaning: "carry", examples: ["export", "portable", "porter"] },
  { root: "pos", meaning: "place, put", examples: ["deposit", "expose", "position"] },
  { root: "post", meaning: "after, behind", examples: ["posthumous", "postpone", "postscript"] },
  { root: "pre", meaning: "earlier, before, in front", examples: ["preamble", "prepare", "prediction"] },
  { root: "pro", meaning: "before, in front of, forward", examples: ["prognosis", "prologue", "prophet"] },
  { root: "prot/o", meaning: "primitive, first, chief", examples: ["prototype", "proton", "protocol"] },
  { root: "pseud/o", meaning: "wrong, false", examples: ["pseudonym", "pseudoscience", "pseudopregnancy"] },
  { root: "psych/o", meaning: "mind, mental", examples: ["psyche", "psychic", "psychology"] },
  { root: "pugn/a/pung", meaning: "to fight", examples: ["pugnacious", "repugnant", "pungent"] },
  { root: "pul", meaning: "urge", examples: ["compulsion", "expulsion", "impulsive"] },
  { root: "purg", meaning: "clean", examples: ["purge", "purgatory", "expurgate"] },
  { root: "put", meaning: "think", examples: ["computer", "dispute", "input"] },
  { root: "pyr/o", meaning: "fire, heat", examples: ["pyrotechnics", "pyrometer", "pyretic"] },
  { root: "quad/r/ri", meaning: "four", examples: ["quadrant", "quadrennium", "quadruped"] },
  { root: "quart", meaning: "fourth", examples: ["quarter", "quart", "quartet"] },
  { root: "quin/t", meaning: "five, fifth", examples: ["quintett", "quintessence", "quintuple"] },
  { root: "radic/radix", meaning: "root", examples: ["eradicate", "radical", "radish"] },
  { root: "radio", meaning: "radiation, ray", examples: ["radioactive", "radiologist"] },
  { root: "ram/i", meaning: "branch", examples: ["ramification", "ramify", "ramus"] },
  { root: "re", meaning: "again, back, backward", examples: ["rebound", "rewind", "reaction"] },
  { root: "reg", meaning: "guide, rule", examples: ["regent", "regime", "regulate"] },
  { root: "retro", meaning: "backward, back", examples: ["retroactive", "retrogress", "retrospect"] },
  { root: "rhin/o", meaning: "nose", examples: ["rhinoceros", "rhinoplasty", "rhinovirus"] },
  { root: "rhod/o", meaning: "red", examples: ["rhododendron", "rhodium", "rhodopsin"] },
  { root: "rid", meaning: "laugh", examples: ["deride", "ridicule", "ridiculous"] },
  { root: "rrh/ea/oea/ag", meaning: "flow, discharge", examples: ["diarrhea", "hemorrhage", "catarrh"] },
  { root: "rub", meaning: "red", examples: ["ruby", "rubella", "bilirubin"] },
  { root: "rupt", meaning: "break, burst", examples: ["bankrupt", "interrupt", "rupture"] },
  { root: "san", meaning: "health", examples: ["sane", "sanitary", "sanitation"] },
  { root: "scend", meaning: "climb, go", examples: ["ascend", "crescendo", "descend"] },
  { root: "sci", meaning: "know", examples: ["conscience", "conscious", "omniscient"] },
  { root: "scler/o", meaning: "hard", examples: ["arteriosclerosis", "multiple sclerosis", "sclerometer"] },
  { root: "scop/e/y", meaning: "see, examine, observe", examples: ["microscope", "periscope", "telescope"] },
  { root: "scrib/script", meaning: "write, written", examples: ["inscribe", "scribe", "describe"] },
  { root: "se", meaning: "apart", examples: ["secede", "seclude", "serum"] },
  { root: "sect", meaning: "cut", examples: ["dissect", "intersection", "bisect"] },
  { root: "sed/sid/sess", meaning: "sit", examples: ["reside", "sediment", "session"] },
  { root: "self", meaning: "of, for, or by itself", examples: ["self-discipline", "self-respect", "selfish"] },
  { root: "semi", meaning: "half, partial", examples: ["semiannual", "semicircle", "semiconscious"] },
  { root: "sept/i", meaning: "seven", examples: ["September", "septet", "septuagenarian"] },
  { root: "serv", meaning: "save, keep", examples: ["conserve", "preserve", "reservation"] },
  { root: "sex", meaning: "six", examples: ["sextet", "sextuple", "sexagenarian"] },
  { root: "sol", meaning: "alone, sun", examples: ["desolate", "solo", "solar"] },
  { root: "somn/I", meaning: "sleep", examples: ["insomnia", "somniloquy", "somnolent"] },
  { root: "son", meaning: "sound", examples: ["consonant", "sonorous", "supersonic"] },
  { root: "soph", meaning: "wise", examples: ["philosopher", "sophisticated", "sophism"] },
  { root: "spec/t/spic", meaning: "see, look", examples: ["circumspect", "retrospective", "spectator"] },
  { root: "sphere", meaning: "ball", examples: ["biosphere", "hemisphere"] },
  { root: "spir", meaning: "breathe", examples: ["inspire", "transpire", "spirit"] },
  { root: "sta", meaning: "strong", examples: ["stable", "stagnant", "stationary"] },
  { root: "stell", meaning: "star", examples: ["constellation", "interstellar", "stellar"] },
  { root: "struct", meaning: "build", examples: ["construct", "destruction", "structure"] },
  { root: "sub", meaning: "under, lower than", examples: ["submarine", "submerge", "substandard"] },
  { root: "sum", meaning: "highest", examples: ["sum", "summation", "summit"] },
  { root: "super", meaning: "higher in quality or quantity", examples: ["Super bowl", "superior", "supersonic"] },
  { root: "sy/m/n/l/s", meaning: "together, with, same", examples: ["symmetry", "synergy", "synchronize"] },
  { root: "tact/tang", meaning: "touch", examples: ["contact", "tactile", "tangible"] },
  { root: "tax/o", meaning: "arrangement", examples: ["syntax", "taxonomy", "ataxia"] },
  { root: "techno", meaning: "technique, skill", examples: ["technology", "technocracy", "technologically"] },
  { root: "tel/e/o", meaning: "far, distant, complete", examples: ["telephone", "telescope", "television"] },
  { root: "temp/or", meaning: "time", examples: ["contemporary", "temporal", "temporary"] },
  { root: "ten/tin/tent", meaning: "hold", examples: ["continent", "detention", "tenacious"] },
  { root: "ter/trit", meaning: "rub", examples: ["attrition", "detritus", "trite"] },
  { root: "term/ina", meaning: "end, limit", examples: ["determine", "terminate", "exterminate"] },
  { root: "terr/a/i", meaning: "land, earth", examples: ["extraterrestrial", "terrain", "territory"] },
  { root: "tetra", meaning: "four", examples: ["tetrapod", "tetrarchy", "tetrose"] },
  { root: "the", meaning: "put", examples: ["bibliotheca", "theme", "thesis"] },
  { root: "the/o", meaning: "god", examples: ["monotheism", "polytheism", "theology"] },
  { root: "therm/o", meaning: "heat", examples: ["thermal", "thermos", "thermostat"] },
  { root: "tort", meaning: "twist", examples: ["contortion", "distort", "retort"] },
  { root: "tox", meaning: "poison", examples: ["detoxification", "toxic", "toxicology"] },
  { root: "tract", meaning: "pull, drag", examples: ["attract", "distract", "tractor"] },
  { root: "trans", meaning: "across, beyond, through", examples: ["transcontinental", "transfer", "transport"] },
  { root: "tri", meaning: "three, once in every three", examples: ["triangle", "triathlon", "tricycle"] },
  { root: "ultra", meaning: "beyond, extreme", examples: ["ultrahigh", "ultramodern", "ultrasonic"] },
  { root: "un", meaning: "not, opposite of, lacking", examples: ["unabridged", "unfair", "unfriendly"] },
  { root: "uni", meaning: "one, single", examples: ["unicycle", "unilateral", "unique"] },
  { root: "urb", meaning: "city", examples: ["suburb", "urban", "urbanology"] },
  { root: "vac", meaning: "empty", examples: ["evacuate", "vacant", "vacation"] },
  { root: "ven/t", meaning: "come", examples: ["circumvent", "convention", "intervene"] },
  { root: "ver/I", meaning: "truth", examples: ["veracious", "veracity", "verify"] },
  { root: "verb", meaning: "word", examples: ["verbalize", "adverb", "proverb"] },
  { root: "vers/vert", meaning: "turn", examples: ["reverse", "introvert", "version"] },
  { root: "vice", meaning: "acting in place of, next in rank", examples: ["vice-president"] },
  { root: "vid", meaning: "see", examples: ["evident"] },
  { root: "vince/vic", meaning: "conquer", examples: ["convince", "invincible", "victory"] },
  { root: "vis/vid", meaning: "see", examples: ["vision", "envision", "evident"] },
  { root: "viv/i/vit", meaning: "live, life", examples: ["revival", "vital", "vivacious"] },
  { root: "voc/i", meaning: "voice, call", examples: ["advocate", "equivocate", "vocalize"] },
  { root: "vol/i/u", meaning: "wish, will", examples: ["benevolent", "volition", "voluntary"] },
  { root: "vor/vour", meaning: "eat", examples: ["carnivorous", "voracious", "devour"] },
  { root: "xanth", meaning: "yellow", examples: ["xanthium", "xanthochromia", "xanthogenic"] },
  { root: "xen/o", meaning: "foreign", examples: ["xenophobic", "xenogenesis", "xenophile"] },
  { root: "xer/o/I", meaning: "dry", examples: ["xerophyte", "xerography", "xeric"] },
  { root: "xyl", meaning: "wood", examples: ["xylocarp", "xyloid", "xylophone"] },
  { root: "zo/o", meaning: "animal life", examples: ["zoology", "zooid", "zooplankton"] },
  { root: "zyg/o", meaning: "pair", examples: ["zygote", "zygomorphic"] }
].sort((a, b) => a.root.localeCompare(b.root));

const SESSION_WORD_COUNT = 15;
const QUESTION_TIMER_SECONDS = 15;

interface LearningCenterProps {
  onAwardXP: (amount: number) => void;
  onUpdateMastery: (word: string, increment: number) => void;
  onLogMistake: (q: Question) => void;
  onRecordAnswer: (isCorrect: boolean) => void;
  wordMastery: Record<string, number>;
  activeSessionWords: VocabularyWord[];
  setActiveSessionWords: (words: VocabularyWord[]) => void;
  words: VocabularyWord[];
  isLoading: boolean;
}

const LearningCenter: React.FC<LearningCenterProps> = ({ 
  onAwardXP, 
  onUpdateMastery, 
  onLogMistake,
  onRecordAnswer,
  wordMastery,
  activeSessionWords,
  setActiveSessionWords,
  words: initialWords,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'grammar' | 'spelling' | 'roots'>('learn');
  const [learnSubTab, setLearnSubTab] = useState<'list' | 'flashcards' | 'session'>('list');
  const [sessionMode, setSessionMode] = useState<'flashcards' | 'matching' | 'racecar'>('flashcards');
  
  const [currentWords, setCurrentWords] = useState<VocabularyWord[]>([]);
  const [spellingQuestions, setSpellingQuestions] = useState<Question[]>([]);
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rootCardIndex, setRootCardIndex] = useState(0);
  const [rootIsFlipped, setRootIsFlipped] = useState(false);

  // Match State
  const [selectedMatch, setSelectedMatch] = useState<{ id: string, type: 'word' | 'def' } | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [matchingError, setMatchingError] = useState<string | null>(null);

  // Race State
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceIndex, setRaceIndex] = useState(0);
  const [raceProgress, setRaceProgress] = useState(0);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceFeedback, setRaceFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [raceOptions, setRaceOptions] = useState<string[]>([]);
  const [raceQuestion, setRaceQuestion] = useState<string>('');
  const [raceTimeLeft, setRaceTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  const raceTimerRef = useRef<number | null>(null);

  const [currentLesson, setCurrentLesson] = useState<GrammarLesson | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingAnswer, setSpellingAnswer] = useState<number | null>(null);
  const [showSpellingResult, setShowSpellingResult] = useState(false);

  // Reset racecar state when exiting
  useEffect(() => {
    if (sessionMode !== 'racecar' || learnSubTab !== 'session') {
      setRaceStarted(false);
      setRaceFinished(false);
      setRaceIndex(0);
      setRaceProgress(0);
      if (raceTimerRef.current) clearInterval(raceTimerRef.current);
    }
  }, [sessionMode, learnSubTab, activeTab]);

  useEffect(() => {
    if (initialWords.length > 0 && currentWords.length === 0) {
      setCurrentWords(initialWords);
    }
  }, [initialWords]);

  const loadGrammarLesson = async (topic: string) => {
    setGrammarLoading(true);
    try {
      const lesson = await generateGrammarLesson(topic);
      setCurrentLesson(lesson);
      setQuizAnswer(null);
      setShowQuizResult(false);
    } catch (e) { console.error(e); } finally { setGrammarLoading(false); }
  };

  const loadSpelling = async () => {
    try {
      const questions = await generateSpellingTest(10);
      setSpellingQuestions(questions);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (activeTab === 'spelling' && spellingQuestions.length === 0) loadSpelling();
    if (activeTab === 'learn' && currentWords.length > 0 && activeSessionWords.length === 0) {
        pickNewSessionBatch(currentWords);
    }
  }, [activeTab, currentWords]);

  const pickNewSessionBatch = (source: VocabularyWord[]) => {
    const subset = [...source].sort(() => Math.random() - 0.5).slice(0, SESSION_WORD_COUNT);
    setActiveSessionWords(subset);
    setCardIndex(0);
    setMatches(new Set());
    setRaceStarted(false);
    setIsFlipped(false);
    setSelectedMatch(null);
  };

  const shuffleFlashcards = () => {
    setCardIndex(0);
    setIsFlipped(false);
    setCurrentWords(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const logVocabMiss = (wordObj: VocabularyWord) => {
    onLogMistake({
      id: `mistake-${wordObj.word}-${Date.now()}`,
      category: Category.VOCABULARY,
      questionText: `Identify the primary definition for the word: ${wordObj.word}`,
      options: [wordObj.definition, "To act with haste without consideration", "A state of complete tranquility", "None of the above"],
      correctAnswer: 0,
      explanation: `Full Definition: ${wordObj.definition}. Context Usage: "${wordObj.exampleSentence}"`
    });
  };

  const filteredWords = useMemo(() => {
    return initialWords.filter(w => 
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.word.localeCompare(b.word));
  }, [initialWords, searchQuery]);

  // Define matchingPairs for the matching game
  const matchingPairs = useMemo(() => {
    const wordsList = activeSessionWords.map(w => ({ id: w.word, text: w.word }));
    const defsList = activeSessionWords.map(w => ({ id: w.word, text: w.definition }));
    
    return {
      words: [...wordsList].sort(() => Math.random() - 0.5),
      defs: [...defsList].sort(() => Math.random() - 0.5)
    };
  }, [activeSessionWords]);

  const handleFlashcardNav = (direction: 'next' | 'prev') => {
    const list = learnSubTab === 'session' ? activeSessionWords : currentWords;
    if (list.length === 0) return;
    if (direction === 'next') setCardIndex((cardIndex + 1) % list.length);
    else setCardIndex((cardIndex - 1 + list.length) % list.length);
    setIsFlipped(false); 
  };

  const handleRootNav = (direction: 'next' | 'prev') => {
    if (ROOT_DATA.length === 0) return;
    if (direction === 'next') setRootCardIndex((rootCardIndex + 1) % ROOT_DATA.length);
    else setRootCardIndex((rootCardIndex - 1 + ROOT_DATA.length) % ROOT_DATA.length);
    setRootIsFlipped(false);
  };

  const handleMatch = (id: string, type: 'word' | 'def') => {
    if (matches.has(id) || matchingError) return;
    if (!selectedMatch) {
      setSelectedMatch({ id, type });
      return;
    }
    if (selectedMatch.id === id && selectedMatch.type !== type) {
      const newMatches = new Set(matches);
      newMatches.add(id);
      setMatches(newMatches);
      onAwardXP(10);
      onRecordAnswer(true);
      setSelectedMatch(null);
    } else if (selectedMatch.id !== id && selectedMatch.type !== type) {
      setMatchingError(`${selectedMatch.id}-${id}`);
      onRecordAnswer(false);
      const missedWord = activeSessionWords.find(w => w.word === selectedMatch.id || w.word === id);
      if (missedWord) logVocabMiss(missedWord);
      setTimeout(() => {
        setMatchingError(null);
        setSelectedMatch(null);
      }, 500);
    } else {
      setSelectedMatch({ id, type });
    }
  };

  const generateRaceStep = useCallback((idx: number, set: VocabularyWord[]) => {
    if (set.length === 0 || idx >= set.length) return;
    const current = set[idx];
    setRaceQuestion(current.definition);
    const correct = current.word;
    const others = set.filter(w => w.word !== correct).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
    setRaceOptions([correct, ...others].sort(() => Math.random() - 0.5));
    setRaceTimeLeft(QUESTION_TIMER_SECONDS);
  }, []);

  useEffect(() => {
    if (raceStarted && !raceFinished && !raceFeedback) {
      raceTimerRef.current = window.setInterval(() => {
        setRaceTimeLeft(prev => {
          if (prev <= 1) {
            handleRaceAnswer("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (raceTimerRef.current) clearInterval(raceTimerRef.current); };
  }, [raceStarted, raceFinished, raceFeedback, raceIndex]);

  const startRace = () => {
    setRaceStarted(true);
    setRaceFinished(false);
    setRaceProgress(0);
    setRaceIndex(0);
    setRaceFeedback(null);
    generateRaceStep(0, activeSessionWords);
  };

  const handleRaceAnswer = (answer: string) => {
    if (raceFeedback || raceFinished) return;
    const correctWord = activeSessionWords[raceIndex];
    const isCorrect = answer === correctWord.word;
    
    if (raceTimerRef.current) clearInterval(raceTimerRef.current);
    onRecordAnswer(isCorrect);

    if (isCorrect) {
      setRaceFeedback('correct');
      const speedBonus = raceTimeLeft > 10 ? 1.8 : raceTimeLeft > 5 ? 1.3 : 1;
      const progressIncrement = (100 / SESSION_WORD_COUNT) * speedBonus;
      setRaceProgress(p => Math.min(100, p + progressIncrement));
      onAwardXP(Math.round(20 * speedBonus));
      onUpdateMastery(answer, 5);
    } else {
      setRaceFeedback(answer === "" ? 'timeout' : 'wrong');
      logVocabMiss(correctWord);
    }

    setTimeout(() => {
      setRaceFeedback(null);
      if (raceIndex + 1 < activeSessionWords.length) {
        setRaceIndex(i => i + 1);
        generateRaceStep(raceIndex + 1, activeSessionWords);
      } else {
        setRaceFinished(true);
      }
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Academy Library</h2>
          <p className="text-slate-500 mt-2 font-medium italic">Advanced training modules for elite admissions candidates.</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-[1.5rem] w-fit mb-12 shadow-inner border border-slate-300">
        <button onClick={() => setActiveTab('learn')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'learn' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Vocabulary</button>
        <button onClick={() => setActiveTab('grammar')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'grammar' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Grammar</button>
        <button onClick={() => setActiveTab('spelling')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'spelling' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Spelling</button>
        <button onClick={() => setActiveTab('roots')} className={`px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest transition-all ${activeTab === 'roots' ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}>Roots & Prefixes</button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-48">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8"></div>
          <p className="text-indigo-900 font-black tracking-[0.4em] uppercase text-[10px]">Processing Academic Core...</p>
        </div>
      ) : activeTab === 'learn' ? (
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex space-x-10">
              {['list', 'flashcards', 'session'].map((t) => (
                <button key={t} onClick={() => { setLearnSubTab(t as any); setCardIndex(0); setIsFlipped(false); }} className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${learnSubTab === t ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  {t === 'list' ? 'Full Study List' : t === 'flashcards' ? 'Flashcard Deck' : 'Session Trainer'}
                </button>
              ))}
            </div>
            {learnSubTab === 'list' && (
              <input type="text" placeholder="Filter terms..." className="pl-10 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm w-72" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            )}
          </div>

          {learnSubTab === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[700px] overflow-y-auto no-scrollbar pb-20">
              {filteredWords.map((w, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all hover:shadow-xl group">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-2xl font-black text-indigo-800 tracking-tighter">{w.word}</h4>
                    {wordMastery[w.word] >= 80 && <span className="text-emerald-500">✔</span>}
                  </div>
                  <p className="text-slate-700 text-sm font-bold mb-6 leading-relaxed line-clamp-6">{w.definition}</p>
                  <div className="pt-6 border-t border-slate-50 italic text-[11px] text-slate-400 font-medium leading-relaxed">"{w.exampleSentence}"</div>
                </div>
              ))}
            </div>
          )}

          {learnSubTab === 'flashcards' && (
             <div className="flex flex-col items-center py-12">
                <div className="w-full max-w-lg h-96 relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                   <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                      <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center">
                        <span className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">Neural Link Engaged</span>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{currentWords[cardIndex]?.word}</h2>
                        <div className="mt-16 text-slate-300 text-[10px] font-black uppercase animate-pulse">Reveal Definition</div>
                      </div>
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar">
                        <p className="text-xl font-bold leading-relaxed px-4">{currentWords[cardIndex]?.definition}</p>
                        <div className="mt-8 pt-8 border-t border-white/10 w-full text-sm italic text-indigo-200 leading-relaxed px-4">"{currentWords[cardIndex]?.exampleSentence}"</div>
                      </div>
                   </div>
                </div>
                <div className="flex items-center space-x-10 mt-16">
                   <button onClick={() => handleFlashcardNav('prev')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
                   <button onClick={() => { onAwardXP(10); onUpdateMastery(currentWords[cardIndex].word, 10); handleFlashcardNav('next'); }} className="px-16 py-6 bg-emerald-500 text-white rounded-[2rem] font-black uppercase text-xs">Verified Mastery</button>
                   <button onClick={() => handleFlashcardNav('next')} className="p-5 bg-white border rounded-2xl shadow-sm hover:border-indigo-400"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
             </div>
          )}

          {learnSubTab === 'session' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4">
               <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
                  <div>
                    <h3 className="text-2xl font-black text-indigo-950 tracking-tighter">Target Session</h3>
                    <p className="text-indigo-600 text-sm font-bold italic">Focusing on {SESSION_WORD_COUNT} prioritized terms.</p>
                  </div>
                  <button onClick={() => pickNewSessionBatch(initialWords)} className="px-10 py-4 bg-white text-indigo-700 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-indigo-200">Shuffle Session</button>
               </div>
               
               <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-[1.25rem] w-fit">
                  {['flashcards', 'matching', 'racecar'].map((m) => (
                    <button key={m} onClick={() => setSessionMode(m as any)} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${sessionMode === m ? 'bg-indigo-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{m}</button>
                  ))}
               </div>
               
               <div className="min-h-[500px]">
                  {sessionMode === 'flashcards' && (
                    <div className="flex flex-col items-center py-8">
                       <div className="w-full max-w-lg h-80 relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                             <div className="absolute w-full h-full backface-hidden bg-white border-2 border-indigo-600 rounded-[3rem] shadow-2xl flex items-center justify-center p-12 text-center"><h2 className="text-4xl font-black text-slate-900 tracking-tighter">{activeSessionWords[cardIndex]?.word}</h2></div>
                             <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 border-2 border-indigo-500 rounded-[3rem] shadow-2xl flex items-center justify-center p-12 text-center text-white overflow-y-auto no-scrollbar"><p className="text-lg font-bold leading-relaxed">{activeSessionWords[cardIndex]?.definition}</p></div>
                          </div>
                       </div>
                       <div className="flex items-center space-x-8 mt-12">
                          <button onClick={() => handleFlashcardNav('prev')} className="p-4 bg-white border rounded-2xl shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
                          <button onClick={() => { onAwardXP(10); handleFlashcardNav('next'); }} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px]">Verified</button>
                          <button onClick={() => handleFlashcardNav('next')} className="p-4 bg-white border rounded-2xl shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
                       </div>
                    </div>
                  )}

                  {sessionMode === 'matching' && (
                    <div className="grid grid-cols-2 gap-10 max-w-5xl mx-auto py-4">
                        <div className="space-y-4">
                           {matchingPairs.words.map((item) => (
                             <button key={`word-${item.id}`} disabled={matches.has(item.id)} onClick={() => handleMatch(item.id, 'word')} className={`w-full p-6 rounded-3xl border-2 font-black text-sm shadow-sm transition-all ${matches.has(item.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-20' : (selectedMatch?.id === item.id && selectedMatch.type === 'word' ? 'border-indigo-600 bg-indigo-50' : 'bg-white border-slate-100 hover:border-indigo-300')} ${matchingError?.includes(item.id) ? 'border-rose-500 bg-rose-50 animate-shake' : ''}`}>{item.text}</button>
                           ))}
                        </div>
                        <div className="space-y-4">
                           {matchingPairs.defs.map((item) => (
                             <button key={`def-${item.id}`} disabled={matches.has(item.id)} onClick={() => handleMatch(item.id, 'def')} className={`w-full p-6 rounded-3xl border-2 font-black text-xs text-left shadow-sm transition-all ${matches.has(item.id) ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-20' : (selectedMatch?.id === item.id && selectedMatch.type === 'def' ? 'border-indigo-600 bg-indigo-50' : 'bg-white border-slate-100 hover:border-indigo-300')} ${matchingError?.includes(item.id) ? 'border-rose-500 bg-rose-50 animate-shake' : ''}`}>{item.text}</button>
                           ))}
                        </div>
                        {matches.size === SESSION_WORD_COUNT && (
                          <div className="col-span-full py-16 text-center bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-[4rem]">
                            <div className="text-8xl mb-6">🏆</div>
                            <h4 className="text-4xl font-black text-emerald-900 tracking-tighter uppercase mb-4">Core Synchronized</h4>
                            <button onClick={() => { onAwardXP(250); pickNewSessionBatch(initialWords); }} className="px-12 py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-sm">Next Batch</button>
                          </div>
                        )}
                    </div>
                  )}

                  {sessionMode === 'racecar' && (
                    <div className="py-4">
                       {!raceStarted ? (
                         <div className="max-w-2xl mx-auto bg-slate-900 p-16 rounded-[4rem] text-center border-b-[12px] border-indigo-600 shadow-2xl">
                            <div className="text-9xl mb-10 text-emerald-400">🏎️</div>
                            <h3 className="text-4xl font-black text-white mb-6 italic tracking-tighter uppercase">Definition Velocity</h3>
                            <p className="text-slate-400 mb-12 text-lg">Speed-match {SESSION_WORD_COUNT} terms. Velocity directly impacts distance gain.</p>
                            <button onClick={startRace} className="w-full py-8 bg-white text-indigo-900 rounded-[2.5rem] font-black uppercase tracking-[0.5em] shadow-xl hover:scale-105 transition-all">Engage Thrusters</button>
                         </div>
                       ) : !raceFinished ? (
                         <div className="max-w-3xl mx-auto bg-slate-900 p-12 rounded-[4rem] shadow-2xl border border-white/10 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                              <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-1000" style={{ width: `${raceProgress}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center mb-10 mt-4">
                               <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-4 py-2 border border-white/10 rounded-full mb-2 text-center">Lap {raceIndex + 1} / {SESSION_WORD_COUNT}</span>
                                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                   <div className={`h-full transition-all ${raceTimeLeft > 10 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : raceTimeLeft > 5 ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_10px_#ef4444]'}`} style={{ width: `${(raceTimeLeft / QUESTION_TIMER_SECONDS) * 100}%` }}></div>
                                 </div>
                               </div>
                               <div className="text-center">
                                  <div className="text-4xl font-black text-white font-mono tabular-nums">{raceTimeLeft}s</div>
                                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Reactor Clock</div>
                               </div>
                            </div>
                            <h4 className="text-2xl font-black text-white mb-12 leading-tight text-center italic">"{raceQuestion}"</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {raceOptions.map((opt, i) => (
                                 <button key={i} disabled={!!raceFeedback} onClick={() => handleRaceAnswer(opt)} className={`py-8 rounded-3xl font-black uppercase text-sm border-2 transition-all ${raceFeedback === 'correct' && opt === activeSessionWords[raceIndex].word ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-105' : raceFeedback === 'wrong' && opt === activeSessionWords[raceIndex].word ? 'bg-rose-500 border-rose-400 text-white scale-95' : 'bg-white/5 border-white/10 text-slate-300 hover:border-indigo-600 hover:bg-white/10'}`}>{opt}</button>
                               ))}
                            </div>
                            {raceFeedback === 'timeout' && (
                              <div className="absolute inset-0 bg-rose-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                                 <div className="text-center">
                                    <div className="text-6xl mb-4">⌛</div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">System Timeout</h3>
                                    <p className="text-rose-200">Velocity reached zero.</p>
                                 </div>
                              </div>
                            )}
                         </div>
                       ) : (
                         <div className="max-w-2xl mx-auto text-center py-24 bg-slate-900 rounded-[5rem] shadow-2xl text-white">
                            <div className="text-9xl mb-10 animate-bounce">🏁</div>
                            <h4 className="text-5xl font-black mb-6 tracking-tighter uppercase">Circuit Mastery Verified</h4>
                            <button onClick={() => setRaceStarted(false)} className="px-20 py-8 bg-indigo-600 text-white rounded-[3rem] font-black uppercase text-sm shadow-2xl">Dashboard</button>
                         </div>
                       )}
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      ) : activeTab === 'spelling' ? (
        <div className="max-w-4xl mx-auto space-y-8">
           {spellingQuestions.length > 0 ? (
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-8 block">Orthography Lab ({spellingIndex + 1}/{spellingQuestions.length})</span>
                <h3 className="text-3xl font-black text-slate-900 mb-10 leading-tight">{spellingQuestions[spellingIndex].questionText}</h3>
                <div className="space-y-4 mb-12">
                   {spellingQuestions[spellingIndex].options.map((opt, i) => (
                     <button key={i} onClick={() => !showSpellingResult && setSpellingAnswer(i)} className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${showSpellingResult ? (i === spellingQuestions[spellingIndex].correctAnswer ? 'border-emerald-500 bg-emerald-50' : (i === spellingAnswer ? 'border-rose-500 bg-rose-50' : 'opacity-40')) : (spellingAnswer === i ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-100 bg-white hover:border-indigo-400')}`}><span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${spellingAnswer === i ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>{String.fromCharCode(65+i)}</span><span className="font-bold text-lg">{opt}</span></button>
                   ))}
                </div>
                {showSpellingResult ? (
                  <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-6">
                     <p className={`text-2xl font-black mb-4 ${spellingAnswer === spellingQuestions[spellingIndex].correctAnswer ? 'text-emerald-400' : 'text-rose-400'}`}>{spellingAnswer === spellingQuestions[spellingIndex].correctAnswer ? 'Authenticated.' : 'Discrepancy Noted.'}</p>
                     <p className="text-slate-300 text-lg italic mb-10 leading-relaxed">"{spellingQuestions[spellingIndex].explanation}"</p>
                     <button onClick={() => { onRecordAnswer(spellingAnswer === spellingQuestions[spellingIndex].correctAnswer); setSpellingAnswer(null); setShowSpellingResult(false); setSpellingIndex((spellingIndex + 1) % spellingQuestions.length); }} className="px-16 py-6 bg-indigo-600 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl">Advance Module</button>
                  </div>
                ) : (
                  <button onClick={() => { setShowSpellingResult(true); if (spellingAnswer !== spellingQuestions[spellingIndex].correctAnswer) onLogMistake(spellingQuestions[spellingIndex]); }} disabled={spellingAnswer === null} className="w-full py-8 bg-indigo-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.6em] shadow-2xl transition-all disabled:opacity-20">Analyze Orthography</button>
                )}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-48"><div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div></div>
           )}
        </div>
      ) : activeTab === 'roots' ? (
        <div className="space-y-16 animate-in fade-in">
          <div className="bg-indigo-950 p-16 rounded-[4rem] text-white flex flex-col items-center shadow-2xl relative overflow-hidden ring-8 ring-indigo-900/20">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-20"></div>
             <div className="w-full max-w-xl h-96 relative perspective-2000 cursor-pointer group" onClick={() => setRootIsFlipped(!rootIsFlipped)}>
                <div className={`relative w-full h-full transition-transform duration-1000 transform-style-3d ${rootIsFlipped ? 'rotate-y-180' : ''}`}>
                   <div className="absolute w-full h-full backface-hidden bg-white rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center shadow-2xl ring-1 ring-white/50">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-10">Classical Origin</span>
                      <h2 className="text-7xl font-black text-indigo-950 tracking-tighter mb-4 group-hover:scale-110 transition-transform">{ROOT_DATA[rootCardIndex]?.root}</h2>
                      <div className="mt-16 text-slate-300 text-[10px] font-black uppercase animate-bounce">Reveal Etymological Insight</div>
                   </div>
                   <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-700 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center shadow-2xl ring-1 ring-indigo-400/50">
                      <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.5em] mb-10">Historical Meaning</span>
                      <h2 className="text-4xl font-black text-white mb-10 leading-tight tracking-tight">{ROOT_DATA[rootCardIndex]?.meaning}</h2>
                      <div className="flex flex-wrap justify-center gap-3">
                        {ROOT_DATA[rootCardIndex]?.examples.map((ex, i) => (
                          <span key={i} className="px-6 py-2.5 bg-indigo-900/50 border border-white/10 rounded-2xl text-sm font-black text-indigo-100 shadow-inner">{ex}</span>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex items-center space-x-16 mt-16">
                <button onClick={() => handleRootNav('prev')} className="p-6 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/5 transition-all"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg></button>
                <div className="flex flex-col items-center"><span className="text-3xl font-black tracking-widest text-white/90 font-mono">{(rootCardIndex + 1).toString().padStart(2, '0')}</span><span className="h-1 w-12 bg-indigo-500 rounded-full my-2"></span><span className="text-sm font-black text-white/30 uppercase tracking-widest">{ROOT_DATA.length}</span></div>
                <button onClick={() => handleRootNav('next')} className="p-6 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/5 transition-all"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></button>
             </div>
          </div>
        </div>
      ) : activeTab === 'grammar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-2.5 max-h-[800px] overflow-y-auto no-scrollbar pr-2 pb-20">
             {GRAMMAR_TOPICS.map((topic, i) => (
               <button key={i} onClick={() => loadGrammarLesson(topic)} className={`w-full text-left px-6 py-5 rounded-[1.5rem] border-2 transition-all shadow-sm flex items-center justify-between group ${currentLesson?.topic === topic ? 'border-indigo-600 bg-indigo-50 font-black text-indigo-700 shadow-md' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
                 <span className="flex-1 text-sm md:text-base pr-4">{topic}</span>
               </button>
             ))}
          </div>
          <div className="lg:col-span-2">
            {grammarLoading ? (
               <div className="h-full flex flex-col items-center justify-center p-32">
                 <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">Compiling Pedagogy...</p>
               </div>
            ) : currentLesson ? (
              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden animate-in slide-in-from-right-10">
                 <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                 <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">{currentLesson.topic}</h3>
                 <p className="text-xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{currentLesson.explanation}</p>
                 <div className="pt-12 border-t-4 border-slate-50 mt-12">
                    <h4 className="text-2xl font-black text-slate-900 mb-10 leading-tight">{currentLesson.quickCheck.question}</h4>
                    <div className="grid grid-cols-1 gap-4 mb-10">
                       {currentLesson.quickCheck.options.map((opt, i) => (
                         <button key={i} onClick={() => !showQuizResult && setQuizAnswer(i)} className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${showQuizResult ? (i === currentLesson.quickCheck.correctAnswer ? 'border-emerald-500 bg-emerald-50 shadow-lg' : (i === quizAnswer ? 'border-rose-500 bg-rose-50' : 'opacity-40')) : (quizAnswer === i ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-100 bg-white hover:border-indigo-400')}`}><span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${quizAnswer === i ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}>{String.fromCharCode(65+i)}</span><span className="font-bold text-lg">{opt}</span></button>
                       ))}
                    </div>
                    {showQuizResult ? (
                      <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl">
                        <h5 className={`text-2xl font-black mb-4 ${quizAnswer === currentLesson.quickCheck.correctAnswer ? 'text-emerald-400' : 'text-rose-400'}`}>{quizAnswer === currentLesson.quickCheck.correctAnswer ? 'Validated.' : 'Discrepancy Noted.'}</h5>
                        <p className="text-slate-300 text-lg italic leading-relaxed font-medium">{currentLesson.quickCheck.explanation}</p>
                      </div>
                    ) : (
                      <button onClick={() => { 
                        setShowQuizResult(true); 
                        onRecordAnswer(quizAnswer === currentLesson.quickCheck.correctAnswer);
                        onAwardXP(25);
                        if (quizAnswer !== currentLesson.quickCheck.correctAnswer) {
                          onLogMistake({
                            id: `grammar-${currentLesson.topic}-${Date.now()}`,
                            category: Category.GRAMMAR,
                            questionText: currentLesson.quickCheck.question,
                            options: currentLesson.quickCheck.options,
                            correctAnswer: currentLesson.quickCheck.correctAnswer,
                            explanation: currentLesson.quickCheck.explanation
                          });
                        }
                      }} disabled={quizAnswer === null} className="w-full py-8 bg-indigo-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] shadow-2xl transition-all disabled:opacity-20">Analyze Logic</button>
                    )}
                 </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-32 border-4 border-dashed border-slate-200 rounded-[4rem] text-slate-300 font-black uppercase">Phase pending selection...</div>
            )}
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        .perspective-1000 { perspective: 1000px; }
        .perspective-2000 { perspective: 2000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LearningCenter;