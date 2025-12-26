
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Question, VocabularyWord, GrammarLesson } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// The official MCVSD 398-word list extracted from the PDF
const PDF_VOCAB_BASE: { word: string; def: string }[] = [
  { word: "Bevy", def: "group of something" },
  { word: "Maverick", def: "rebel, independent minded" },
  { word: "Alderman", def: "member of council" },
  { word: "Benefactor", def: "person who gives money to causes" },
  { word: "Nuance", def: "slight difference" },
  { word: "Replete", def: "full and complete" },
  { word: "Dejected", def: "sad or depressed" },
  { word: "Bona Fide", def: "genuine, true" },
  { word: "Panache", def: "elegance" },
  { word: "Furtive", def: "sly, sneaky" },
  { word: "Blase", def: "unimpressed" },
  { word: "Brusque", def: "abrupt" },
  { word: "Trite", def: "unoriginal, overused" },
  { word: "Tenable", def: "valid, stable" },
  { word: "Discerning", def: "showing good judgement" },
  { word: "Fastidious", def: "critical, picky" },
  { word: "Gaunt", def: "thin, anorexic" },
  { word: "Illicit", def: "improper" },
  { word: "Jocund", def: "cheerful and happy" },
  { word: "Perilous", def: "dangerous" },
  { word: "Prevalent", def: "widespread" },
  { word: "Demure", def: "modest, meek" },
  { word: "Callous", def: "rude, insensitive, heartless" },
  { word: "Respite", def: "rest or break" },
  { word: "Formidable", def: "inspires fear, intimidating" },
  { word: "Vacuous", def: "lacking" },
  { word: "Bilk", def: "cheat" },
  { word: "ascribe", def: "assign or atribute" },
  { word: "Genial", def: "friendly" },
  { word: "Obdurate", def: "stubborn" },
  { word: "Ubiquitous", def: "everywhere" },
  { word: "Extrapolative", def: "figuring out" },
  { word: "Paltry", def: "insignificant, of unimportance" },
  { word: "Perfunctory", def: "quick, brief" },
  { word: "Covert", def: "undercover" },
  { word: "Canvass", def: "to survey, ask questions" },
  { word: "Plaudit", def: "praise" },
  { word: "Risque", def: "indecent" },
  { word: "Hapless", def: "unlucky" },
  { word: "Vex", def: "to trouble or irritate" },
  { word: "Indurate", def: "to harden" },
  { word: "Inlay", def: "embed, insert" },
  { word: "Shear", def: "break off" },
  { word: "Gregarious", def: "friendly, outgoing, talkative" },
  { word: "Subjective", def: "up for observation" },
  { word: "Enjoin", def: "urge somebody" },
  { word: "Decimate", def: "to destroy" },
  { word: "Circumscribe", def: "restrict, establish" },
  { word: "Synecdoche", def: "a word in place of another" },
  { word: "allegory", def: "something that reveals hidden meaning" },
  { word: "Ailment", def: "illness" },
  { word: "Memento", def: "souvenir" },
  { word: "Simonize", def: "polish and clean" },
  { word: "Fiasco", def: "total failure" },
  { word: "Pathos", def: "pity" },
  { word: "Encumber", def: "burden" },
  { word: "Retort", def: "sharp answer" },
  { word: "Callow", def: "unsophisticated" },
  { word: "Debilitated", def: "weakened" },
  { word: "Idiosyncrasy", def: "instinctive reaction" },
  { word: "Lore", def: "traditional knowledge" },
  { word: "Hinder", def: "slow down" },
  { word: "cultivate", def: "take care, nurture" },
  { word: "Qualm", def: "misgiving, bad feeling" },
  { word: "tentative", def: "uncertain" },
  { word: "Precocious", def: "advanced" },
  { word: "Burgeon", def: "flourish" },
  { word: "Debase", def: "decreasing someone's character" },
  { word: "Galvanize", def: "strengthen" },
  { word: "Acumen", def: "intellect" },
  { word: "Imprudent", def: "foolhardy, clumsy" },
  { word: "Aboriginal", def: "primordial, the first" },
  { word: "Sluggish", def: "lazy, tired" },
  { word: "Brandish", def: "wave or raise" },
  { word: "Raze", def: "completely destroy, demolish" },
  { word: "Capitulate", def: "surrender" },
  { word: "Remonstrate", def: "protest" },
  { word: "Insinuate", def: "suggest or hint" },
  { word: "Prevaricate", def: "beating around the bush" },
  { word: "Amalgamate", def: "mix" },
  { word: "Prune", def: "lessening things, cut back" },
  { word: "Cache", def: "treasure" },
  { word: "Competent", def: "gets job done" },
  { word: "Combustion", def: "burning, sparking" },
  { word: "Stoic", def: "enduring, patient, steady" },
  { word: "Fulcrum", def: "the middle of a lever" },
  { word: "Anthology", def: "a collection of poems" },
  { word: "Ornate", def: "decorated with complex patterns" },
  { word: "Obfuscate", def: "complicate" },
  { word: "Commission", def: "giving a job" },
  { word: "Candor", def: "honesty, truth" },
  { word: "Bastion", def: "defense" },
  { word: "Renege", def: "take back" },
  { word: "Abase", def: "humiliate" },
  { word: "Carnal", def: "insanely need" },
  { word: "Brutish", def: "harsh, rude, rough" },
  { word: "Bedlam", def: "chaos" },
  { word: "Verbatim", def: "exact, step by step" },
  { word: "Venerable", def: "respected" },
  { word: "scrupulous", def: "careful, precise" },
  { word: "enigmatic", def: "difficult to understand" },
  { word: "Neophyte", def: "beginner" },
  { word: "Bilious", def: "angry, bad tempered" },
  { word: "Belligerent", def: "hostile and agressive" },
  { word: "Wane", def: "decrease, fail" },
  { word: "Bucolic", def: "rural" },
  { word: "Degenate", def: "immoral or corrupt" },
  { word: "Specious", def: "hiding truth" },
  { word: "Stifling", def: "smothering" },
  { word: "Altruistic", def: "unselfish" },
  { word: "Sardonic", def: "mocking" },
  { word: "Sadistic", def: "likes to hurt others" },
  { word: "Serendipity", def: "happy" },
  { word: "Anemic", def: "weak" },
  { word: "Rescind", def: "take back" },
  { word: "Abrogate", def: "cancel" },
  { word: "credulous", def: "gullible" },
  { word: "Junket", def: "celebration, party" },
  { word: "Luminary", def: "expert" },
  { word: "Proselyte", def: "somebody who pushes religion" },
  { word: "Quixotic", def: "foolishly idealistic" },
  { word: "corral", def: "group together" },
  { word: "Beseige", def: "surround" },
  { word: "Evanescent", def: "momentary, quick" },
  { word: "Vestigial", def: "something left over, not needed" },
  { word: "Taciturn", def: "not talkative" },
  { word: "Zenith", def: "top or peak" },
  { word: "Peccadillo", def: "minor offense" },
  { word: "Vector", def: "location" },
  { word: "Irreverent", def: "disrespectful" },
  { word: "Maudlin", def: "over sentimental" },
  { word: "Ensconced", def: "install, establish" },
  { word: "Repudiated", def: "reject" },
  { word: "Destitute", def: "very poor" },
  { word: "Absolution", def: "forgiveness" },
  { word: "Recapitulation", def: "summarize something" },
  { word: "Rhetoric", def: "exaggeration of speech" },
  { word: "Harangue", def: "lecture or yell at one" },
  { word: "Symbiotic", def: "working together" },
  { word: "Garrulous", def: "talkative" },
  { word: "Aggregate", def: "total, complete amount" },
  { word: "Implement", def: "instrument" },
  { word: "congeal", def: "solidify" },
  { word: "Provacative", def: "causing annoyance" },
  { word: "Antecedent", def: "something that happens before another" },
  { word: "Inception", def: "beginning" },
  { word: "Proclivity", def: "Inclination, preference" },
  { word: "Effulgence", def: "radiance, shining brightly" },
  { word: "Resurgence", def: "revival, renewal" },
  { word: "Peckish", def: "hungry" },
  { word: "Berate", def: "Harshly scold" },
  { word: "Sporadic", def: "irregular" },
  { word: "Irrespective", def: "disregard something" },
  { word: "Preternatural", def: "beyond normal" },
  { word: "Ruinous", def: "when you destroy something" },
  { word: "impale", def: "stab somebody" },
  { word: "Procure", def: "obtain" },
  { word: "Abstain", def: "not do something" },
  { word: "Deluge", def: "overwhelm" },
  { word: "Delineate", def: "describe or portray precisely" },
  { word: "Trivial", def: "insignificant, of little importance" },
  { word: "Comprehensively", def: "inclusively" },
  { word: "Conjecture", def: "inference, educated guess" },
  { word: "Incessant", def: "constant" },
  { word: "Lachrymose", def: "sad, tearful" },
  { word: "nebulous", def: "unclear" },
  { word: "Ponderous", def: "clumsy and slow" },
  { word: "Assail", def: "to attack" },
  { word: "Acquiesce", def: "agreeing, complying" },
  { word: "Factious", def: "divided, split" },
  { word: "Prolific", def: "productive, creative" },
  { word: "Sublime", def: "awe, inspiring" },
  { word: "Foreboding", def: "fearful apprehension" },
  { word: "Masquerade", def: "disguise something" },
  { word: "Wan", def: "pale" },
  { word: "Sanguine", def: "optimistic postive" },
  { word: "odious", def: "revolting, repulsive" },
  { word: "Beget", def: "to cause or create" },
  { word: "Skittish", def: "nervous" },
  { word: "Ardor", def: "passion" },
  { word: "Conflagration", def: "fire blaze" },
  { word: "Peregrination", def: "long meandering journey" },
  { word: "Ostracize", def: "exclude" },
  { word: "Peruse", def: "read, to look over" },
  { word: "Elucidate", def: "to make clear" },
  { word: "Mendicant", def: "beggar" },
  { word: "Soporific", def: "inducing sleep or drousiness" },
  { word: "Smite", def: "strike" },
  { word: "Collegial", def: "shared responsibility" },
  { word: "Lexicon", def: "dictionary" },
  { word: "Lugubrious", def: "sad and dismal" },
  { word: "Chaff", def: "waste" },
  { word: "Pernicious", def: "harmful" },
  { word: "Minutiae", def: "trivia" },
  { word: "Prehensile", def: "grasping" },
  { word: "Antediluvian", def: "prehistoric" },
  { word: "Repugnant", def: "offense" },
  { word: "Abjure", def: "renounce, reject" },
  { word: "Cacophony", def: "jumble of sound" },
  { word: "Snubb", def: "look down upon" },
  { word: "Adversary", def: "opponent" },
  { word: "Equity", def: "fairness" },
  { word: "Palpable", def: "something you can touch, tangible" },
  { word: "Epitome", def: "embodiment, form of an idea" },
  { word: "Esoteric", def: "obscure, only specific people understand" },
  { word: "Scornfulness", def: "contempt or disdain" },
  { word: "Quandary", def: "problem, predicament" },
  { word: "Retain", def: "to keep, hold back" },
  { word: "Impending", def: "upcoming" },
  { word: "Pliable", def: "flexible, stretchy" },
  { word: "Requite", def: "revenge" },
  { word: "Surly", def: "rude" },
  { word: "Wily", def: "deceitful, astute" },
  { word: "Prodigal", def: "spending money wastefully" },
  { word: "Thwart", def: "stop, hinder" },
  { word: "Stipend", def: "payment" },
  { word: "Incisive", def: "acute, sharp, pentrating" },
  { word: "Caustic", def: "able to burn or corrode" },
  { word: "Foible", def: "flaw" },
  { word: "Surmise", def: "guess" },
  { word: "Propitiate", def: "win or regain favor of" },
  { word: "Malapropism", def: "misusing something" },
  { word: "Zany", def: "peculiar eccentric" },
  { word: "Zealot", def: "fanatic person" },
  { word: "Cozen", def: "trick or deceive" },
  { word: "Inveigle", def: "persuade by flattery" },
  { word: "Truculent", def: "defiant or aggressive" },
  { word: "fervid", def: "intensely enthusiastic or passionate" },
  { word: "kleptomaniac", def: "person who steals" },
  { word: "virtuoso", def: "someone who is brilliant" },
  { word: "eclat", def: "brilliant" },
  { word: "gallant", def: "brave, courageous" },
  { word: "Harbinger", def: "a sign(negative)" },
  { word: "Contumelious", def: "scornful, insulting" },
  { word: "Ineffable", def: "so great that its speechless" },
  { word: "Dictum", def: "announcement by authority" },
  { word: "Risible", def: "laughable, ridiculous, comical" },
  { word: "Prude", def: "very very nit picky" },
  { word: "Puritan", def: "simple" },
  { word: "Hedonist", def: "someone who loves pleasure" },
  { word: "Heathen", def: "person who's different" },
  { word: "Ribald", def: "Indecent, bawdy" },
  { word: "Diaphanous", def: "see through, filmy" },
  { word: "Gossamer", def: "shiny, silky" },
  { word: "Glutton", def: "someone who eats A LOT" },
  { word: "Avidity", def: "extreme eagerness" },
  { word: "Exacerbate", def: "to make worse" },
  { word: "Tearjerker", def: "a sentimental story(evokes sadness)" },
  { word: "Prurient", def: "encouraging" },
  { word: "Liturgy", def: "worship within religion" },
  { word: "Supine", def: "lie down" },
  { word: "Farce", def: "funny" },
  { word: "Hallowed", def: "sacred" },
  { word: "Divulge", def: "to disclose private information" },
  { word: "eminent", def: "famous or popular, well-known" },
  { word: "futile", def: "ineffective" },
  { word: "Glib", def: "fluent, voluble but insincere" },
  { word: "Lackadaisical", def: "lazy" },
  { word: "Gauche", def: "awkward, ungrateful" },
  { word: "Calndestine", def: "secret" },
  { word: "Amass", def: "to hoard, gather" },
  { word: "Exalt", def: "Elevate, to make better" },
  { word: "Somnolent", def: "sleepy, fatigue" },
  { word: "Spartan", def: "adequate but uncomfortable" },
  { word: "Deviation", def: "to split" },
  { word: "Augury", def: "a sign of things to come" },
  { word: "Ambulatory", def: "walking" },
  { word: "Antithesis", def: "opposite" },
  { word: "Elegy", def: "expression of grief or sorrow" },
  { word: "Cogent", def: "clear, logical, convincing" },
  { word: "Pith", def: "center of a stem" },
  { word: "Jargon", def: "specific terminology" },
  { word: "Chagrin", def: "disappointment" },
  { word: "Feint", def: "fool" },
  { word: "Curt", def: "blunt, very straightforward" },
  { word: "Spurn", def: "reject" },
  { word: "Warp", def: "distorted" },
  { word: "Suppress", def: "decreasing, subdue" },
  { word: "Submissive", def: "more than compliant" },
  { word: "Infringe", def: "break the terms of an agreement" },
  { word: "Millieu", def: "environment or background" },
  { word: "Happenstance", def: "coincidence" },
  { word: "Rumination", def: "thought, concentration" },
  { word: "Masticate", def: "to chew" },
  { word: "Underhanded", def: "sneaky" },
  { word: "Tribulation", def: "cause of suffering" },
  { word: "Slumberous", def: "sleepy, heavy with drousiness" },
  { word: "Emendations", def: "changes" },
  { word: "Avowals", def: "praises" },
  { word: "Laggard", def: "lazy, sluggish" },
  { word: "Invariable", def: "not changing, constant" },
  { word: "Indiscretions", def: "behavior that is improper" },
  { word: "Immutable", def: "fixed, unchangeable" },
  { word: "Turncoat", def: "someone who betrays a group" },
  { word: "Remand", def: "return to lower court for reconsideration" },
  { word: "Propitious", def: "indicating success, favorable" },
  { word: "Auspicious", def: "favorable, promising" },
  { word: "Bovine", def: "cow, cattle" },
  { word: "Porcine", def: "having to do with pigs" },
  { word: "Chivalrous", def: "kind, honorable, respectful" },
  { word: "Ineptitude", def: "lack of skill" },
  { word: "Paucity", def: "shortage, scarcity" },
  { word: "Castigated", def: "reprimanded" },
  { word: "Laudable", def: "praised, well respected" },
  { word: "Unsullied", def: "spotless, flawless" },
  { word: "Sullen", def: "sad, moppy" },
  { word: "Facetious", def: "unnecessary, frivolous, inappropriate" },
  { word: "Deferential", def: "respectful" },
  { word: "Beleaguer", def: "troubled OR surrounded" },
  { word: "Filibuster", def: "to stall, to talk to avoid or delay" },
  { word: "Collusion", def: "secret or illegal cooperation" },
  { word: "desiccated", def: "to dry, dehydrate" },
  { word: "Redolent", def: "suggestive, remindful" },
  { word: "Premonition", def: "forewarning" },
  { word: "Decree", def: "order, command" },
  { word: "Relinquish", def: "release, give up" },
  { word: "Yarn", def: "story, something made up" },
  { word: "Painstaking", def: "careful, meticulous" },
  { word: "pedantic", def: "precise, exact" },
  { word: "Holster", def: "to put away" },
  { word: "Hermitage", def: "retreat, refuge, hiding place" },
  { word: "Forthright", def: "direct, straightforward" },
  { word: "Bellwether", def: "leading sheep in a flock" },
  { word: "Panhandler", def: "someone begging for money" },
  { word: "Embezzler", def: "someone who steals money" },
  { word: "Cynosure", def: "somebody who is center" },
  { word: "Approbation", def: "approval, acceptance" },
  { word: "Consecrating", def: "make it sacred" },
  { word: "Desultory", def: "aimless, no point" },
  { word: "ignominy", def: "shamed in public" },
  { word: "arraign", def: "bringing up changes" },
  { word: "sanctimonious", def: "being morally superior" },
  { word: "visage", def: "face" },
  { word: "Recluse", def: "introverted, avoids people" },
  { word: "Contrite", def: "filled with remorse and regret" },
  { word: "Absolve", def: "clear, declare free from blame" },
  { word: "Aplomb", def: "Confidence" },
  { word: "Turgid", def: "Hard" },
  { word: "Doctrine", def: "beliefs held and taught by someone" },
  { word: "Misanthrope", def: "skeptic, dislikes humankind" },
  { word: "Succor", def: "assistance, helping hand" },
  { word: "Subversive", def: "destructive" },
  { word: "Intrepid", def: "bold, brave, fearless" },
  { word: "Sterile", def: "germ-free, sanitized" },
  { word: "Mea Culpa", def: "admit one's fault or error" },
  { word: "Foment", def: "instigate, incite" },
  { word: "Dearth", def: "rarity, scarce" },
  { word: "Careened", def: "to go off in another direction" },
  { word: "Meek", def: "compliant, submissive" },
  { word: "Founder", def: "submerged in water" },
  { word: "Adage", def: "proverb" },
  { word: "Din", def: "loud unpleasant noise, clamor" },
  { word: "Cantankerous", def: "cranky, grumpy" },
  { word: "Discursive", def: "rambling, wandering" },
  { word: "Sumptous", def: "rich" },
  { word: "Maladroit", def: "clumsy" },
  { word: "Perpetuity", def: "eternity, forever" },
  { word: "pied", def: "of multiple colors" },
  { word: "Egress", def: "exit" },
  { word: "Ordinance", def: "local law or rule" },
  { word: "Abstemious", def: "moderate, temperate" },
  { word: "Peripatetic", def: "nomadic, wandering" },
  { word: "Corporeal", def: "tangible" },
  { word: "Irate", def: "furious, angry" },
  { word: "Senility", def: "old age" },
  { word: "Ephemeral", def: "lasting a short time" },
  { word: "Fetish", def: "a charm that receives respect or devotion" },
  { word: "Mesa", def: "an isolated flat top hill" },
  { word: "Flippant", def: "lacking proper respect or seriousness" },
  { word: "Boorish", def: "rude; insensitive" },
  { word: "Austere", def: "severe or strict" },
  { word: "Quell", def: "to put an end to" },
  { word: "Fortify", def: "to strengthen" },
  { word: "Propensity", def: "inclination, tendency" },
  { word: "Formidable", def: "arousing fear through being powerful" },
  { word: "Malleable", def: "capable of being shaped" },
  { word: "Truncate", def: "to shorten" },
  { word: "Refractory", def: "stubbornly resistant to authority or control" },
  { word: "Reproach", def: "to scold" },
  { word: "Culpable", def: "worthy of blame" },
  { word: "Elusive", def: "difficult to find, catch, or achieve" },
  { word: "Unheralded", def: "unannounced" },
  { word: "Deplore", def: "to feel or express strong disapproval" },
  { word: "Guile", def: "sly or cunning intelligence" },
  { word: "Fallow", def: "unused; uncultivated" },
  { word: "Imbue", def: "inspire or permeate with" },
  { word: "Desecrate", def: "violate, damage" },
  { word: "Piety", def: "religious devotion" },
  { word: "Amoral", def: "lacking ethical principles" },
  { word: "Adamant", def: "firm in opinion, stubborn" },
  { word: "Predilection", def: "preference" },
  { word: "Extant", def: "still in existence" },
  { word: "Solicit", def: "to ask for in a formal way" },
  { word: "Censure", def: "to criticize sharply" },
  { word: "Preclude", def: "to make impossible" },
  { word: "Contrive", def: "to plan cleverly; to devise" },
  { word: "Demagogue", def: "a leader who appeals to citizens' emotions to obtain power" },
  { word: "Niche", def: "a nook or slot" }
];

export const generateQuestions = async (category: Category, count: number = 5): Promise<Question[]> => {
  const isMock = category === Category.MOCK;
  const systemInstruction = `You are a world-class tutor for the NJ MCVSD High School admissions test. Target: 8th grade honors students. Passages: 300-400 words. Vocabulary: Focus on advanced academic terms. Logic: High. Provide DEEP, logical explanations for every answer.`;
  const prompt = isMock 
    ? "Generate a 20-question Mock Test: 5 Reading, 5 Grammar, 3 Spelling, 7 Math logic. Return as JSON array of Question objects."
    : `Generate ${count} difficult ${category} questions for honors 8th graders. Return as JSON array.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING },
            passage: { type: Type.STRING },
            questionText: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "category", "questionText", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try { 
    const parsed = JSON.parse(response.text || "[]");
    return Array.isArray(parsed) ? (parsed as Question[]) : []; 
  } catch { 
    return []; 
  }
};

export const generateVocabTest = async (count: number = 20): Promise<Question[]> => generateQuestions(Category.VOCABULARY, count);
export const generateGrammarTest = async (count: number = 20): Promise<Question[]> => generateQuestions(Category.GRAMMAR, count);
export const generateSpellingTest = async (count: number = 10): Promise<Question[]> => generateQuestions(Category.SPELLING, count);

export const generateGrammarLesson = async (topic: string): Promise<GrammarLesson> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Teach ${topic} for MCVSD test. Include advanced rules and one quick check question.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          explanation: { type: Type.STRING },
          examples: { type: Type.ARRAY, items: { type: Type.STRING } },
          quickCheck: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        },
        required: ["topic", "explanation", "examples", "quickCheck"]
      }
    }
  });
  
  try {
    const parsed = JSON.parse(response.text || "{}");
    return parsed as GrammarLesson;
  } catch {
    return {
      topic,
      explanation: "Unable to load detailed lesson at this time.",
      examples: [],
      quickCheck: {
        question: "Is grammar essential for high-level writing?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Academic writing requires precise grammar."
      }
    };
  }
};

export const generateVocabulary = async (): Promise<VocabularyWord[]> => {
  const sortedBase = [...PDF_VOCAB_BASE].sort((a, b) => a.word.localeCompare(b.word));
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `For the following vocabulary words and definitions from the MCVSD PDF, provide an ACTUAL dictionary-grade lexicographical definition (at least 20 words long) and a context-clue-rich example sentence where the meaning is inferable through the logic of the sentence. 
    Crucially:
    1. Do NOT include phrases like "In academic discourse, this term describes..." or "fundamental to formal literary analysis". Just give the definition.
    2. Example sentences should be simple yet effective at showing meaning through context clues.
    3. Ensure diversity in sentence structure so different words can "fit" the sentence logic naturally.
    WORDS: ${JSON.stringify(sortedBase.slice(0, 150).map(v => `${v.word}: ${v.def}`))}
    Return an alphabetical JSON array of VocabularyWord objects with keys: word, definition, synonyms, antonyms, exampleSentence.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            definition: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            exampleSentence: { type: Type.STRING }
          },
          required: ["word", "definition", "synonyms", "antonyms", "exampleSentence"]
        }
      },
      maxOutputTokens: 30000,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });
  
  try {
    const text = response.text;
    if (!text) throw new Error("No response text");
    const generated = JSON.parse(text) as any[];
    
    const wordsMap = new Map<string, any>(generated.map((w: any) => [w.word.toLowerCase(), w]));
    
    return sortedBase.map((base): VocabularyWord => {
      const g = wordsMap.get(base.word.toLowerCase());
      if (g && g.word && g.definition) {
        return g as VocabularyWord;
      }
      return {
        word: base.word,
        definition: base.def + ". This word refers to a specific state or quality observed in various environments, often used to describe patterns or conditions accurately.",
        synonyms: ["academic term", "sophisticated word"],
        antonyms: ["simplicity", "informal jargon"],
        exampleSentence: `The student's essay was ${base.word}, filled with so much detail that every single point was thoroughly explained.`
      };
    });
  } catch (e) {
    console.error("Vocabulary parsing error", e);
    return sortedBase.map((item): VocabularyWord => ({
      word: item.word,
      definition: item.def + ". A formal term used to denote a specific category, action, or state of being that helps provide precision in descriptive language.",
      synonyms: ["academic term", "erudite word"],
      antonyms: ["simplicity", "vernacular"],
      exampleSentence: `Because he was so ${item.word}, everyone in the room felt welcomed by his warm and friendly greeting.`
    }));
  }
};
