
import React, { useState } from 'react';

interface Note {
  title: string;
  content: string;
  details?: string;
}

const NOTES_DATA: Record<string, Note[]> = {
  grammar: [
    { 
      title: "The Comma Master-Plan", 
      content: "Complete rules for comma placement in complex academic writing.",
      details: "RULES FOR MCVSD SUCCESS:\n\n1. FANBOYS: Use a comma BEFORE for, and, nor, but, or, yet, so when joining two complete sentences.\n2. INTRODUCTORY ELEMENTS: Use after 'Because...', 'Since...', 'While...' at the sentence start.\n3. THE APPOSITIVE WRAP: Surround non-essential nouns (e.g., The teacher, Mr. Jones, is here.)\n4. THE OXFORD COMMA: Essential for lists of 3+ items. Always use it on this test."
    },
    { 
      title: "Subject-Verb Agreement", 
      content: "Solving the most common traps in grammar sections.",
      details: "TRAPS TO AVOID:\n\n- Collective Nouns: 'The class' is singular, 'The classes' are plural.\n- Intervening Phrases: Ignore phrases like 'as well as' or 'along with'. (e.g., The captain, along with his crew, IS ready.)\n- Indefinite Pronouns: 'Everyone', 'Each', 'Neither' are ALWAYS singular.\n- Closer Subject Rule: With 'neither/nor', the verb matches the noun CLOSEST to it."
    },
    { 
      title: "Modifiers: Misplaced & Dangling", 
      content: "Correcting sentences that don't make logical sense.",
      details: "DANGLING MODIFIERS: When the person doing the action is missing.\n- Error: Barking loudly, the mailman ran away. (Mailman wasn't barking).\n- Fix: Barking loudly, the DOG made the mailman run away.\n\nMISPLACED MODIFIERS: Words too far from the noun they describe.\n- Error: I saw a bird with a telescope. (Did the bird have a telescope?)\n- Fix: Using a telescope, I saw a bird."
    },
    { 
      title: "Parallelism and Tense", 
      content: "Maintaining structural balance and consistent timeframes.",
      details: "PARALLELISM: Keep all items in a series in the same form.\n- Bad: He likes to fish, hiking, and swim.\n- Good: He likes fishing, hiking, and swimming.\n\nTENSE CONSISTENCY: Don't jump from past to present without logic.\n- Bad: He walked into the room and starts yelling.\n- Good: He walked into the room and started yelling."
    },
    {
      title: "Punctuation Precision",
      content: "Mastering Colons, Semicolons, and Dashes.",
      details: "1. SEMICOLONS (;): Join two independent sentences that are closely related without a conjunction.\n2. COLONS (:): Must follow a full sentence. Use before a list or an explanation.\n3. DASHES (—): Use to emphasize an abrupt break or a sudden change in thought."
    }
  ],
  vocabulary: [
    { 
      title: "Master Lexicon: A-Z Roots & Prefixes", 
      content: "Exhaustive directory of Latin and Greek segments from the academy directory.",
      details: "• a/n: not/without\n• ab/s: from/away\n• a/c/d: toward/near\n• acro: top/height\n• act: do\n• aer/o: air\n• agr/i: farming\n• alg/o: pain\n• ambi: both\n• ambul: walk\n• ami/o: love\n• ana: up/back/again\n• andr/o: man\n• anim: spirit/life\n• ann/enn: year\n• ante: before\n• anth/o: flower\n• anthrop: human\n• anti: against\n• apo/apho: separate\n• aqu/a: water\n• arbor: tree\n• arch/i: chief/rule\n• astro: star\n• aud/i: hear\n• auto: self\n• avi: bird\n• bar/o: pressure\n• bell/i: war\n• bene: good\n• bi/n: two\n• bio: life\n• blast: cell\n• burs: pouch\n• calc: stone\n• cand: glowing\n• capt/cept: take\n• cardi: heart\n• carn: flesh\n• cata: down/against\n• caust: burn\n• cede/ceed: go/yield\n• celer: fast\n• cent: hundred\n• centr: center\n• cephal: head\n• cerebr: brain\n• cert: sure\n• chrom: color\n• chron: time\n• cide: kill\n• circum: around\n• claim/clam: shout\n• clar: clear\n• clud/clus: close\n• cline: lean\n• co/con: together\n• cogn: know\n• contra: against\n• corp: body\n• cosm: universe\n• counter: opposite\n• cred: believe\n• cruc: cross\n• crypto: hidden\n• cumul: heap\n• curr: run\n• cycl: circle\n• de: reduce/away\n• dec/deka: ten\n• dem/o: people\n• demi: half\n• dent: tooth\n• derm: skin\n• di/s: apart/not\n• dia: through\n• dict: speak\n• domin: master\n• duc/t: lead\n• dur: hard/last\n• dyn: power\n• dys: bad/abnormal\n• ego: self\n• endo: within\n• epi: on/over\n• equ: equal\n• eu: good\n• ex: out\n• extra: beyond\n• fac: make/do\n• fer: carry\n• fid: faith\n• flect: bend\n• flor: flower\n• form: shape\n• fract: break\n• fug: flee\n• fus: pour\n• gen: birth/kind\n• geo: earth\n• graph/y: writing\n• hyper: over\n• inter: between\n• mal: bad/wrong\n• micro: small\n• omni: all\n• path: emotion\n• phil/o: love\n• phon/o: sound\n• port: carry\n• scrib/script: write\n• tele/o: far/distant\n• viv/i/vit: live"
    },
    { 
      title: "Contextual Clue Decoders", 
      content: "Strategies for defining 500+ words using textual hints.",
      details: "1. RESTATEMENT: Look for 'that is', 'or', or 'in other words'.\n2. EXAMPLE HINTS: Words like 'including', 'such as', and 'for instance' provide definitions by list.\n3. CONTRAST: Look for 'but', 'however', 'conversely' to find the antonym and flip it.\n4. LOGIC: Use the overall tone of the sentence to determine if a word is positive or negative."
    }
  ],
  reading: [
    { 
      title: "Reading: Purpose & Tone", 
      content: "The P.I.E framework for author's intention.",
      details: "P - PERSUADE: Uses opinions or calls to action.\nI - INFORM: Neutral tone, facts, no bias.\nE - ENTERTAIN: Narratives, vivid imagery.\n\nTONE DETECTION: Look at word choice (Diction). Are words 'gloomy' or 'radiant'? Is the tone 'Objective' (fact-based) or 'Subjective' (opinionated)?"
    },
    { 
      title: "Finding the Main Idea", 
      content: "Strategies to pinpoint the central claim quickly.",
      details: "1. THESIS CHECK: Read the LAST sentence of the FIRST paragraph.\n2. TOPIC SKIM: Check the first sentence of every paragraph.\n3. TRAP: If an answer choice only fits one paragraph, it's a DETAIL, not the Main Idea."
    },
    { 
      title: "Context Clue Mastery", 
      content: "The I.D.E.A.S method for defining unknown words.",
      details: "I - Inference: General logic of the scene.\nD - Definition: Text gives an explicit meaning.\nE - Example: A list follows the word.\nA - Antonym: A contrast word (unlike, but).\nS - Synonym: A similar word (also, like)."
    },
    {
      title: "Paired Passage Analysis",
      content: "Synthesizing information across two different texts.",
      details: "1. READ P1 FIRST: Answer only the questions for P1.\n2. READ P2 SECOND: Answer only the questions for P2.\n3. COMPARISON: Focus on where the authors AGREE and where they DISAGREE. Don't let your personal opinion influence the author's voice."
    }
  ]
};

const ShortNotes: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'grammar' | 'vocabulary' | 'reading'>('grammar');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cheat Sheets & Quick Guides</h2>
        <p className="text-slate-500 font-medium italic">High-impact summaries for your MCVSD preparation. Click any card to expand.</p>
      </header>

      <div className="flex flex-wrap gap-2 bg-slate-200 p-1.5 rounded-2xl w-fit mb-10 shadow-inner">
        {['grammar', 'vocabulary', 'reading'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${activeCategory === cat ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:text-slate-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NOTES_DATA[activeCategory].map((note, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedNote(note)}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col hover:border-indigo-200 transition-all hover:shadow-md cursor-pointer group relative overflow-hidden"
          >
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 font-black text-xs shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {idx + 1}
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-700 transition-colors">{note.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-2">{note.content}</p>
            <div className="mt-auto pt-6 text-indigo-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              Expand Note
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-indigo-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-10 duration-500 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-4 bg-indigo-600 w-full shrink-0"></div>
            
            <button 
              onClick={() => setSelectedNote(null)}
              className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="flex-1 overflow-y-auto p-10 md:p-16 no-scrollbar">
              <span className="text-[12px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-6 block">MCVSD Mastery Guide</span>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 tracking-tighter leading-tight border-b border-slate-100 pb-8">{selectedNote.title}</h3>
              
              <div className="prose prose-indigo max-w-none">
                <div className="whitespace-pre-wrap text-slate-800 font-medium leading-[1.8] text-xl md:text-2xl">
                  {selectedNote.details || selectedNote.content}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-end">
              <button 
                onClick={() => setSelectedNote(null)}
                className="px-12 py-5 bg-indigo-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Close Module
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ShortNotes;
