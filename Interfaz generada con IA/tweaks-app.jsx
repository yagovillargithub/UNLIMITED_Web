// Tweaks app for index.html (extracted to avoid inline Babel parsing issues)

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "ink-sage",
  "font": "editorial",
  "dark": true,
  "heroVariant": "orbital"
}/*EDITMODE-END*/;

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(()=>{
    UNL.applyTweakState({
      palette: t.palette, font: t.font, dark: t.dark, heroVariant: t.heroVariant
    });
    UNL.saveTweaks(t);
  }, [t]);
  return (
    <TweaksPanel title="Tweaks · UNLIMITED">
      <TweakSection label="Paleta" />
      <TweakRadio
        label="Color"
        value={t.palette}
        options={[
          {value:"ink-sage", label:"Ink"},
          {value:"bone-ink", label:"Bone"},
          {value:"forest",   label:"Forest"},
          {value:"mono",     label:"Mono"}
        ]}
        onChange={(v)=>setTweak("palette", v)}
      />
      <TweakToggle label="Modo oscuro" value={t.dark} onChange={(v)=>setTweak("dark", v)} />
      <TweakSection label="Tipografía" />
      <TweakRadio
        label="Familia"
        value={t.font}
        options={[
          {value:"editorial", label:"Editorial"},
          {value:"modern",    label:"Modern"},
          {value:"techno",    label:"Techno"}
        ]}
        onChange={(v)=>setTweak("font", v)}
      />
      <TweakSection label="Hero" />
      <TweakRadio
        label="Variante"
        value={t.heroVariant}
        options={[
          {value:"orbital", label:"Orbital"},
          {value:"grid",    label:"Grid"},
          {value:"type",    label:"Type"}
        ]}
        onChange={(v)=>setTweak("heroVariant", v)}
      />
    </TweaksPanel>
  );
}

const _root = document.getElementById("tweaks-root");
if (_root) ReactDOM.createRoot(_root).render(<App/>);
