# Translation review — the sentences that matter most

Generated from `src/i18n/catalogues.ts` by a script, so what is below is exactly what ships.

Every string in the app's twelve other languages was written by a model, not run through a
translation service — and not one has been read by a native speaker. These are the
24 that matter most: the ones a reader is asked to act on, and the ones that make a
claim the atlas has to be able to defend.

**For a reviewer:** read your language's section against the English. Mark anything that is
wrong, stiff, or would make you trust the site less. Placeholders in braces — `{n}`, `{place}`,
`{need}` — are filled in by the app and must stay exactly as they are. Dish, ingredient and
place names are never translated, deliberately.

## Español (`es`)

### The ask on every record

| English | Español | Note |
|---|---|---|
| Is this how it’s made where you’re from? | ¿Se hace así de donde tú eres? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Si cocinas esto donde nació, confirmarlo o corregirlo es lo que saca un registro de Sin verificar. Cuando tu versión sea distinta, se registra al lado — no en lugar — de esta. | |
| Yes — this matches | Sí, coincide | |
| It’s made differently where I’m from | Donde yo soy se hace de otra manera | |
| Is this dish from where we say it is? | ¿Este plato es de donde decimos que es? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Nadie ha escrito cómo se hace este, así que todavía no hay nada con lo que estar de acuerdo. El lugar es lo que este registro afirma, y eso ya merece confirmarse por sí solo: es una de las seis comprobaciones de prueba. | |
| Yes — it’s from here | Sí, es de aquí | |
| No — it’s from somewhere else | No, es de otro sitio | |

### Confirming

| English | Español | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Confirma lo que sabes de verdad. No tienes que responder por todo el registro: una cosa concreta de alguien que lo cocina vale más que un acuerdo general. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Sin sesión iniciada. Lo que escribas se mostrará en el registro con tu vínculo, y no moverá la insignia: esa cuenta solo sube con personas que han iniciado sesión, para que una persona no pueda ser tres. | |
| Sign in, so it counts | Inicia sesión para que cuente | |
| Signed in — this will count toward the badge. | Sesión iniciada: esto contará para la insignia. | |
| Recorded. Thank you. | Registrado. Gracias. | |
| You have already confirmed this one. | Ya has confirmado este. | |

### How far a record is from the badge

| English | Español | Note |
|---|---|---|
| Nobody has yet | Todavía nadie | |
| {n} people | {n} personas | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. La insignia exige {need}, así que {people} vinculadas a {place} cumplirían el requisito. | |

### An empty record

| English | Español | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | Nadie ha escrito cómo se prepara {dish}. Serías la primera persona en hacerlo. | |
| Record how it’s made | Registra cómo se prepara | |

### Proposing a dish

| English | Español | Note |
|---|---|---|
| Record a dish you know | Registra un plato que conozcas | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | Enviarla no la publica. Primero {n} personas que conocen el plato lo confirman, y entra en el atlas con lo que sus pruebas merezcan, igual que cualquier otro registro. | |

### The argument on /how

| English | Español | Note |
|---|---|---|
| The version recorded here | La versión registrada aquí | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | Dos de esas seis no las responde ningún documento jamás escrito: ninguna enciclopedia es una persona del lugar. La tercera, la técnica, solo se responde cuando un catálogo oficial de patrimonio publica el método de producción que protege. Con ellas vacías, un registro alcanza como máximo {ceiling} con fuentes publicadas: {registered} cuando ese catálogo existe. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Un registro se llama Auténtico a partir de {threshold}. La distancia entre esas dos cifras es deliberada, y es todo el argumento: solo pueden cerrarla quienes conocen el plato. | |

## Français (`fr`)

### The ask on every record

| English | Français | Note |
|---|---|---|
| Is this how it’s made where you’re from? | Est-ce ainsi qu’on le prépare chez vous ? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Si vous cuisinez ce plat là d’où il vient, le confirmer ou le corriger est ce qui sort une fiche de Non vérifié. Là où votre version diffère, elle est consignée à côté de celle-ci — et non à sa place. | |
| Yes — this matches | Oui, cela correspond | |
| It’s made differently where I’m from | Chez moi, on le fait autrement | |
| Is this dish from where we say it is? | Ce plat vient-il bien de là où nous le disons ? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Personne n’a écrit comment celui-ci se prépare, il n’y a donc encore rien avec quoi être d’accord. Le lieu est ce que cette fiche affirme, et cela vaut d’être confirmé en soi : c’est l’une des six vérifications de preuve. | |
| Yes — it’s from here | Oui, c’est d’ici | |
| No — it’s from somewhere else | Non, cela vient d’ailleurs | |

### Confirming

| English | Français | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Confirmez ce que vous savez réellement. Vous n’avez pas à répondre de toute la fiche : une chose précise, dite par quelqu’un qui le cuisine, vaut mieux qu’un accord général. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Non connecté. Ce que vous écrivez sera affiché sur la fiche avec votre lien au lieu, et ne fera pas bouger le badge : ce compte ne monte que pour les personnes connectées, afin qu’une seule personne ne puisse pas en valoir trois. | |
| Sign in, so it counts | Connectez-vous pour que cela compte | |
| Signed in — this will count toward the badge. | Connecté — cela comptera pour le badge. | |
| Recorded. Thank you. | Enregistré. Merci. | |
| You have already confirmed this one. | Vous avez déjà confirmé celui-ci. | |

### How far a record is from the badge

| English | Français | Note |
|---|---|---|
| Nobody has yet | Personne pour l’instant | |
| {n} people | {n} personnes | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. Le badge exige {need}, donc {people} liées à {place} y suffiraient. | |

### An empty record

| English | Français | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | Personne n’a écrit comment {dish} se prépare. Vous seriez la première personne à le faire. | |
| Record how it’s made | Enregistrez comment on la prépare | |

### Proposing a dish

| English | Français | Note |
|---|---|---|
| Record a dish you know | Consignez un plat que vous connaissez | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | L’envoyer ne la publie pas. {n} personnes qui connaissent le plat la confirment d’abord, et elle entre dans l’atlas selon ce que ses preuves valent, comme toute autre fiche. | |

### The argument on /how

| English | Français | Note |
|---|---|---|
| The version recorded here | La version enregistrée ici | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | Deux de ces six ne peuvent être renseignées par aucun document jamais écrit : aucune encyclopédie n’est une personne du lieu. La troisième, la technique, ne l’est que lorsqu’un registre patrimonial publie la méthode de production qu’il protège. Sans elles, une fiche atteint au mieux {ceiling} à partir de sources publiées — {registered} lorsqu’un tel registre existe. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Une fiche est dite Authentique à partir de {threshold}. L’écart entre ces deux chiffres est délibéré, et c’est tout l’argument : seules les personnes qui connaissent le plat peuvent le combler. | |

## Deutsch (`de`)

### The ask on every record

| English | Deutsch | Note |
|---|---|---|
| Is this how it’s made where you’re from? | Wird es bei Ihnen so gemacht? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Wenn Sie das dort kochen, wo es herkommt, ist Bestätigen oder Berichtigen genau das, was einen Eintrag aus Ungeprüft herausholt. Wo Ihre Fassung abweicht, wird sie neben dieser festgehalten — nicht an ihrer Stelle. | |
| Yes — this matches | Ja, das stimmt so | |
| It’s made differently where I’m from | Bei mir zu Hause macht man es anders | |
| Is this dish from where we say it is? | Stammt dieses Gericht von dort, wo wir es angeben? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Niemand hat aufgeschrieben, wie dieses gemacht wird, also gibt es hier noch nichts, dem man zustimmen könnte. Der Ort ist das, was dieser Eintrag behauptet, und das allein ist eine Bestätigung wert — er ist eine der sechs Belegprüfungen. | |
| Yes — it’s from here | Ja, es ist von hier | |
| No — it’s from somewhere else | Nein, es kommt von woanders | |

### Confirming

| English | Deutsch | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Bestätigen Sie, was Sie wirklich wissen. Sie müssen nicht für den ganzen Eintrag geradestehen — eine bestimmte Sache von jemandem, der es kocht, wiegt mehr als allgemeine Zustimmung. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Nicht angemeldet. Was Sie schreiben, steht mit Ihrer Verbindung auf dem Eintrag und bewegt das Abzeichen nicht: Diese Zahl steigt nur für angemeldete Menschen, damit eine Person nicht drei sein kann. | |
| Sign in, so it counts | Anmelden, damit es zählt | |
| Signed in — this will count toward the badge. | Angemeldet — das zählt für das Abzeichen. | |
| Recorded. Thank you. | Erfasst. Danke. | |
| You have already confirmed this one. | Sie haben dieses hier schon bestätigt. | |

### How far a record is from the badge

| English | Deutsch | Note |
|---|---|---|
| Nobody has yet | Bisher niemand | |
| {n} people | {n} Personen | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. Das Abzeichen verlangt {need}, also würden {people} mit Verbindung zu {place} dafür reichen. | |

### An empty record

| English | Deutsch | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | Niemand hat aufgeschrieben, wie {dish} zubereitet wird. Sie wären die erste Person. | |
| Record how it’s made | Halten Sie fest, wie es zubereitet wird | |

### Proposing a dish

| English | Deutsch | Note |
|---|---|---|
| Record a dish you know | Halten Sie ein Gericht fest, das Sie kennen | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | Absenden veröffentlicht es nicht. Zuerst bestätigen {n} Menschen, die das Gericht kennen, und es kommt mit dem in den Atlas, was seine Belege wert sind — wie jeder andere Eintrag hier. | |

### The argument on /how

| English | Deutsch | Note |
|---|---|---|
| The version recorded here | Die hier festgehaltene Version | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | Zwei dieser sechs kann kein jemals geschriebenes Dokument beantworten: keine Enzyklopädie ist ein Mensch aus dem Ort. Die dritte, die Technik, nur dort, wo ein Herkunftsregister das geschützte Herstellungsverfahren veröffentlicht. Ohne sie erreicht ein Eintrag aus veröffentlichten Quellen höchstens {ceiling} — {registered}, wo es ein solches Register gibt. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Ein Eintrag heißt ab {threshold} echt. Der Abstand zwischen diesen beiden Zahlen ist Absicht und ist das ganze Argument: Schließen können ihn nur Menschen, die das Gericht kennen. | |

## Italiano (`it`)

### The ask on every record

| English | Italiano | Note |
|---|---|---|
| Is this how it’s made where you’re from? | Da te si fa così? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Se lo cucini là da dove viene, confermarlo o correggerlo è ciò che porta una scheda fuori da Non verificato. Dove la tua versione è diversa, viene registrata accanto a questa — non al suo posto. | |
| Yes — this matches | Sì, corrisponde | |
| It’s made differently where I’m from | Da me si fa diversamente | |
| Is this dish from where we say it is? | Questo piatto viene davvero da dove diciamo? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Nessuno ha scritto come si fa questo, quindi non c’è ancora nulla con cui essere d’accordo. Il luogo è ciò che questa scheda afferma, e vale la pena confermarlo di per sé: è una delle sei verifiche di prova. | |
| Yes — it’s from here | Sì, è di qui | |
| No — it’s from somewhere else | No, viene da un altro posto | |

### Confirming

| English | Italiano | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Conferma quello che sai davvero. Non devi rispondere di tutta la scheda: una cosa precisa detta da chi lo cucina vale più di un consenso generico. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Non hai effettuato l’accesso. Quello che scrivi comparirà sulla scheda con il tuo legame, e non muoverà il distintivo: quel conteggio sale solo per chi ha effettuato l’accesso, così una persona non può valerne tre. | |
| Sign in, so it counts | Accedi, così conta | |
| Signed in — this will count toward the badge. | Hai effettuato l’accesso: questo conterà per il distintivo. | |
| Recorded. Thank you. | Registrato. Grazie. | |
| You have already confirmed this one. | Questo l’hai già confermato. | |

### How far a record is from the badge

| English | Italiano | Note |
|---|---|---|
| Nobody has yet | Ancora nessuno | |
| {n} people | {n} persone | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. Il distintivo richiede {need}, quindi {people} legate a {place} basterebbero. | |

### An empty record

| English | Italiano | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | Nessuno ha scritto come si prepara {dish}. Saresti la prima persona a farlo. | |
| Record how it’s made | Registra come si prepara | |

### Proposing a dish

| English | Italiano | Note |
|---|---|---|
| Record a dish you know | Registra un piatto che conosci | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | Inviarlo non lo pubblica. Prima {n} persone che conoscono il piatto lo confermano, e entra nell’atlante per quanto valgono le sue prove, come ogni altra scheda. | |

### The argument on /how

| English | Italiano | Note |
|---|---|---|
| The version recorded here | La versione registrata qui | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | Due di queste sei non può rispondervi nessun documento mai scritto: nessuna enciclopedia è una persona del posto. La terza, la tecnica, solo dove un registro di tutela pubblica il metodo di produzione che protegge. Senza di esse, una scheda arriva al massimo a {ceiling} con fonti pubblicate: {registered} dove quel registro esiste. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Una scheda si dice Autentica a {threshold}. La distanza fra quei due numeri è voluta ed è tutto l’argomento: può colmarla solo chi conosce il piatto. | |

## Português (`pt`)

### The ask on every record

| English | Português | Note |
|---|---|---|
| Is this how it’s made where you’re from? | É assim que se faz na sua terra? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Se cozinha isto no lugar de onde vem, confirmá-lo ou corrigi-lo é o que tira um registo de Por verificar. Onde a sua versão for diferente, fica registada ao lado desta — não no lugar dela. | |
| Yes — this matches | Sim, corresponde | |
| It’s made differently where I’m from | Na minha terra faz-se de outra maneira | |
| Is this dish from where we say it is? | Este prato é mesmo de onde dizemos? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Ninguém escreveu como este se faz, por isso ainda não há nada com que concordar. O lugar é o que este registo afirma, e isso vale ser confirmado por si só — é uma das seis verificações de prova. | |
| Yes — it’s from here | Sim, é daqui | |
| No — it’s from somewhere else | Não, vem de outro sítio | |

### Confirming

| English | Português | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Confirme o que sabe mesmo. Não tem de responder pelo registo todo — uma coisa concreta de quem o cozinha vale mais do que uma concordância geral. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Sem sessão iniciada. O que escrever aparece no registo com a sua ligação, e não mexe no distintivo: essa contagem só sobe com pessoas com sessão iniciada, para que uma pessoa não possa valer três. | |
| Sign in, so it counts | Inicie sessão para contar | |
| Signed in — this will count toward the badge. | Sessão iniciada — isto vai contar para o distintivo. | |
| Recorded. Thank you. | Registado. Obrigado. | |
| You have already confirmed this one. | Já confirmou este. | |

### How far a record is from the badge

| English | Português | Note |
|---|---|---|
| Nobody has yet | Ainda ninguém | |
| {n} people | {n} pessoas | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. O distintivo exige {need}, por isso {people} ligadas a {place} chegariam. | |

### An empty record

| English | Português | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | Ninguém escreveu como se prepara {dish}. Seria a primeira pessoa a fazê-lo. | |
| Record how it’s made | Registe como se prepara | |

### Proposing a dish

| English | Português | Note |
|---|---|---|
| Record a dish you know | Registe um prato que conhece | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | Enviá-la não a publica. Primeiro {n} pessoas que conhecem o prato confirmam-na, e entra no atlas conforme as suas provas valerem, tal como qualquer outro registo. | |

### The argument on /how

| English | Português | Note |
|---|---|---|
| The version recorded here | A versão registada aqui | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | Duas destas seis não podem ser respondidas por nenhum documento alguma vez escrito: nenhuma enciclopédia é uma pessoa do lugar. A terceira, a técnica, só onde um registo de património publica o método de produção que protege. Sem elas, um registo do atlas atinge no máximo {ceiling} com fontes publicadas — {registered} onde esse registo existe. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Um registo é chamado Autêntico a partir de {threshold}. A distância entre esses dois números é deliberada e é todo o argumento: só pode ser fechada por quem conhece o prato. | |

## Nederlands (`nl`)

### The ask on every record

| English | Nederlands | Note |
|---|---|---|
| Is this how it’s made where you’re from? | Wordt het bij u zo gemaakt? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Als u dit kookt op de plek waar het vandaan komt, is bevestigen of corrigeren precies wat een record uit Niet geverifieerd haalt. Waar uw versie afwijkt, wordt die naast deze vastgelegd — niet in plaats ervan. | |
| Yes — this matches | Ja, dit klopt | |
| It’s made differently where I’m from | Bij ons wordt het anders gemaakt | |
| Is this dish from where we say it is? | Komt dit gerecht echt van waar wij zeggen? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Niemand heeft opgeschreven hoe dit gemaakt wordt, dus er is nog niets om het mee eens te zijn. De plaats is wat dit record beweert, en dat is op zichzelf al de moeite van het bevestigen waard — het is een van de zes bewijscontroles. | |
| Yes — it’s from here | Ja, het is van hier | |
| No — it’s from somewhere else | Nee, het komt ergens anders vandaan | |

### Confirming

| English | Nederlands | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Bevestig wat u werkelijk weet. U hoeft niet voor het hele record in te staan — één specifiek ding van iemand die het kookt weegt zwaarder dan algemene instemming. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Niet aangemeld. Wat u schrijft komt met uw band op het record te staan en verandert het insigne niet: die telling stijgt alleen voor aangemelde mensen, zodat één persoon er niet drie kan zijn. | |
| Sign in, so it counts | Meld u aan, dan telt het | |
| Signed in — this will count toward the badge. | Aangemeld — dit telt mee voor het insigne. | |
| Recorded. Thank you. | Vastgelegd. Dank u. | |
| You have already confirmed this one. | U hebt deze al bevestigd. | |

### How far a record is from the badge

| English | Nederlands | Note |
|---|---|---|
| Nobody has yet | Nog niemand | |
| {n} people | {n} personen | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. Het insigne vraagt {need}, dus {people} met een band met {place} zouden voldoen. | |

### An empty record

| English | Nederlands | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | Niemand heeft opgeschreven hoe {dish} wordt gemaakt. Jij zou de eerste zijn. | |
| Record how it’s made | Leg vast hoe het gemaakt wordt | |

### Proposing a dish

| English | Nederlands | Note |
|---|---|---|
| Record a dish you know | Leg een gerecht vast dat u kent | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | Versturen publiceert het niet. Eerst bevestigen {n} mensen die het gerecht kennen het, en het komt in de atlas met wat zijn bewijs waard is — net als elk ander record hier. | |

### The argument on /how

| English | Nederlands | Note |
|---|---|---|
| The version recorded here | De hier vastgelegde versie | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | Twee van die zes kan geen enkel geschreven document beantwoorden: geen encyclopedie is een mens uit die plaats. De derde, de techniek, alleen waar een erfgoedregister de beschermde bereidingswijze publiceert. Zonder die drie haalt een record met gepubliceerde bronnen hooguit {ceiling} — {registered} waar zo’n register bestaat. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Een record heet Echt vanaf {threshold}. De afstand tussen die twee getallen is bewust en is het hele argument: alleen mensen die het gerecht kennen kunnen hem dichten. | |

## Polski (`pl`)

### The ask on every record

| English | Polski | Note |
|---|---|---|
| Is this how it’s made where you’re from? | Czy u ciebie robi się to tak? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Jeśli gotujesz to tam, skąd pochodzi, potwierdzenie albo poprawienie jest tym, co wyciąga wpis z Niesprawdzonych. Tam, gdzie twoja wersja się różni, zostaje zapisana obok tej — a nie zamiast niej. | |
| Yes — this matches | Tak, zgadza się | |
| It’s made differently where I’m from | U mnie robi się to inaczej | |
| Is this dish from where we say it is? | Czy ta potrawa naprawdę pochodzi stamtąd, gdzie podajemy? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Nikt nie zapisał, jak się to robi, więc nie ma tu jeszcze z czym się zgadzać. Miejsce jest tym, co ten wpis twierdzi, i samo w sobie warto je potwierdzić — to jedna z sześciu kontroli dowodowych. | |
| Yes — it’s from here | Tak, jest stąd | |
| No — it’s from somewhere else | Nie, pochodzi skądinąd | |

### Confirming

| English | Polski | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Potwierdź to, co naprawdę wiesz. Nie musisz ręczyć za cały wpis — jedna konkretna rzecz od kogoś, kto to gotuje, waży więcej niż ogólna zgoda. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Nie zalogowano. To, co napiszesz, pokaże się na wpisie razem z twoim związkiem z miejscem i nie ruszy odznaki: ten licznik rośnie tylko dla osób zalogowanych, żeby jedna osoba nie mogła być trzema. | |
| Sign in, so it counts | Zaloguj się, żeby to się liczyło | |
| Signed in — this will count toward the badge. | Zalogowano — to policzy się do odznaki. | |
| Recorded. Thank you. | Zapisane. Dziękujemy. | |
| You have already confirmed this one. | Tę już potwierdziłeś. | |

### How far a record is from the badge

| English | Polski | Note |
|---|---|---|
| Nobody has yet | Na razie nikt | |
| {n} people | {n} osoby | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. Odznaka wymaga {need}, więc {people} związanych z miejscem {place} by wystarczyło. | |

### An empty record

| English | Polski | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | Nikt nie zapisał, jak przygotowuje się {dish}. Byłbyś pierwszą osobą. | |
| Record how it’s made | Zapisz, jak się to przyrządza | |

### Proposing a dish

| English | Polski | Note |
|---|---|---|
| Record a dish you know | Zapisz potrawę, którą znasz | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | Wysłanie jej nie publikuje. Najpierw potwierdza ją {n} osób, które znają tę potrawę, i trafia do atlasu z tym, na co zasłużyły jej dowody — tak jak każdy inny wpis. | |

### The argument on /how

| English | Polski | Note |
|---|---|---|
| The version recorded here | Wersja zapisana tutaj | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | Na dwa z tych sześciu nie odpowie żaden kiedykolwiek napisany dokument: żadna encyklopedia nie jest człowiekiem z tego miejsca. Na trzeci, technikę, odpowiada tylko rejestr chronionych produktów, który publikuje metodę wytwarzania. Bez nich wpis osiąga ze źródeł publikowanych najwyżej {ceiling} — {registered} tam, gdzie taki rejestr istnieje. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Wpis nazywa się Autentycznym od {threshold}. Odstęp między tymi dwiema liczbami jest zamierzony i jest całym argumentem: zamknąć go mogą tylko ludzie, którzy znają tę potrawę. | |

## Türkçe (`tr`)

### The ask on every record

| English | Türkçe | Note |
|---|---|---|
| Is this how it’s made where you’re from? | Sizin oralarda böyle mi yapılır? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Bunu geldiği yerde pişiriyorsanız, doğrulamanız ya da düzeltmeniz bir kaydı Doğrulanmamış olmaktan çıkaran şeydir. Sizin yaptığınızın farklı olduğu yerlerde, bunun yerine değil, bunun yanına kaydedilir. | |
| Yes — this matches | Evet, uyuyor | |
| It’s made differently where I’m from | Bizim oralarda başka türlü yapılır | |
| Is this dish from where we say it is? | Bu yemek gerçekten söylediğimiz yerden mi? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Bunun nasıl yapıldığını kimse yazmamış, dolayısıyla henüz katılınacak bir şey yok. Yer, bu kaydın ileri sürdüğü şeydir ve tek başına doğrulanmaya değer — altı kanıt denetiminden biridir. | |
| Yes — it’s from here | Evet, buranın | |
| No — it’s from somewhere else | Hayır, başka bir yerden | |

### Confirming

| English | Türkçe | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Gerçekten bildiğinizi doğrulayın. Kaydın tamamına kefil olmanız gerekmez — onu pişiren birinden gelen belirli bir şey, genel bir onaydan daha değerlidir. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Oturum açık değil. Yazdıklarınız bağınızla birlikte kayıtta görünecek ama işareti oynatmayacak: o sayı yalnızca oturum açmış kişilerle yükselir, böylece bir kişi üç kişi olamaz. | |
| Sign in, so it counts | Sayılması için oturum açın | |
| Signed in — this will count toward the badge. | Oturum açık — bu, işaret için sayılacak. | |
| Recorded. Thank you. | Kaydedildi. Teşekkürler. | |
| You have already confirmed this one. | Bunu zaten doğruladınız. | |

### How far a record is from the badge

| English | Türkçe | Note |
|---|---|---|
| Nobody has yet | Henüz kimse | |
| {n} people | {n} kişi | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. İşaret {need} istiyor, yani {place} ile bağı olan {people} bunu karşılardı. | |

### An empty record

| English | Türkçe | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | {dish} nasıl yapılır, kimse yazmamış. İlk yazan siz olurdunuz. | |
| Record how it’s made | Nasıl yapıldığını kaydedin | |

### Proposing a dish

| English | Türkçe | Note |
|---|---|---|
| Record a dish you know | Bildiğiniz bir yemeği kaydedin | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | Göndermek onu yayımlamaz. Önce yemeği bilen {n} kişi doğrular ve kanıtı ne kadarsa o değerle atlasa girer — buradaki her kayıt gibi. | |

### The argument on /how

| English | Türkçe | Note |
|---|---|---|
| The version recorded here | Burada kaydedilen hâli | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | Bu altısından ikisini yazılmış hiçbir belge yanıtlayamaz: hiçbir ansiklopedi o yerin insanı değildir. Üçüncüsünü, tekniği, yalnızca koruduğu üretim yöntemini yayımlayan bir tescil kaydı yanıtlar. Bunlar boşken bir kayıt, yayımlanmış kaynaklarla en çok {ceiling} alır — böyle bir tescil varsa {registered}. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Bir kayda {threshold} puandan itibaren Otantik denir. Bu iki sayı arasındaki mesafe bilinçlidir ve bütün mesele odur: onu ancak yemeği bilenler kapatabilir. | |

## Русский (`ru`)

### The ask on every record

| English | Русский | Note |
|---|---|---|
| Is this how it’s made where you’re from? | У вас его готовят так? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | Если вы готовите это там, откуда оно родом, ваше подтверждение или поправка — именно то, что выводит запись из состояния «Не проверено». Там, где ваш вариант отличается, он записывается рядом с этим, а не вместо него. | |
| Yes — this matches | Да, совпадает | |
| It’s made differently where I’m from | У нас готовят иначе | |
| Is this dish from where we say it is? | Это блюдо действительно оттуда, откуда мы указываем? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | Никто не записал, как готовят именно это, так что соглашаться пока не с чем. Место — это то, что утверждает запись, и его стоит подтвердить само по себе: это одна из шести проверок доказательств. | |
| Yes — it’s from here | Да, оно отсюда | |
| No — it’s from somewhere else | Нет, оно из другого места | |

### Confirming

| English | Русский | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | Подтвердите то, что вы действительно знаете. Ручаться за всю запись не нужно: одна конкретная вещь от человека, который это готовит, весит больше, чем общее согласие. | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | Вы не вошли. Написанное вами появится в записи вместе с вашей связью с местом, но знак не сдвинет: этот счёт растёт только за счёт вошедших, чтобы один человек не мог быть тремя. | |
| Sign in, so it counts | Войдите, чтобы это засчиталось | |
| Signed in — this will count toward the badge. | Вы вошли — это будет засчитано к знаку. | |
| Recorded. Thank you. | Записано. Спасибо. | |
| You have already confirmed this one. | Вы это уже подтверждали. | |

### How far a record is from the badge

| English | Русский | Note |
|---|---|---|
| Nobody has yet | Пока никто | |
| {n} people | {n} человека | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}. Знак требует {need}, так что {people}, связанных с местом {place}, хватило бы. | |

### An empty record

| English | Русский | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | Никто не записал, как готовят {dish}. Вы были бы первым. | |
| Record how it’s made | Запишите, как это готовят | |

### Proposing a dish

| English | Русский | Note |
|---|---|---|
| Record a dish you know | Запишите блюдо, которое знаете | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | Отправка не публикует его. Сначала {n} человек, знающих блюдо, подтверждают его, и оно входит в атлас с тем, чего стоят его свидетельства, — как и любая другая запись. | |

### The argument on /how

| English | Русский | Note |
|---|---|---|
| The version recorded here | Версия, записанная здесь | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | На два из этих шести не ответит ни один когда-либо написанный документ: ни одна энциклопедия не является человеком из этого места. На третий — технику — отвечает только реестр, публикующий защищаемый им способ производства. Без них запись набирает по опубликованным источникам не более {ceiling} — {registered}, если такой реестр есть. | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | Запись называется подлинной начиная с {threshold}. Расстояние между этими двумя числами задумано намеренно, и в нём весь смысл: закрыть его могут только люди, которые знают это блюдо. | |

## हिन्दी (`hi`)

### The ask on every record

| English | हिन्दी | Note |
|---|---|---|
| Is this how it’s made where you’re from? | क्या आपके यहाँ इसे ऐसे ही बनाते हैं? | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | अगर आप इसे वहीं पकाते हैं जहाँ से यह आता है, तो आपका पुष्टि करना या सुधारना ही वह चीज़ है जो किसी रिकॉर्ड को असत्यापित से बाहर निकालती है। जहाँ आपका तरीक़ा अलग हो, वह इसके साथ दर्ज होता है — इसकी जगह नहीं। | |
| Yes — this matches | हाँ, यही मेल खाता है | |
| It’s made differently where I’m from | मेरे यहाँ इसे अलग तरह बनाते हैं | |
| Is this dish from where we say it is? | क्या यह व्यंजन सचमुच वहीं का है जहाँ का हम बता रहे हैं? | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | यह कैसे बनता है, किसी ने लिखा ही नहीं, इसलिए अभी सहमत होने के लिए कुछ है ही नहीं। जगह वह है जो यह रिकॉर्ड दावा करता है, और उसकी पुष्टि अपने आप में क़ीमती है — यह छह प्रमाण-जाँचों में से एक है। | |
| Yes — it’s from here | हाँ, यह यहीं का है | |
| No — it’s from somewhere else | नहीं, यह कहीं और का है | |

### Confirming

| English | हिन्दी | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | वही पुष्टि करें जो आप सचमुच जानते हैं। आपको पूरे रिकॉर्ड की ज़िम्मेदारी नहीं लेनी — इसे पकाने वाले किसी व्यक्ति की एक ठोस बात, आम सहमति से ज़्यादा क़ीमती है। | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | साइन इन नहीं है। आप जो लिखेंगे वह आपके जुड़ाव के साथ रिकॉर्ड पर दिखेगा, पर बैज नहीं हिलाएगा: वह गिनती सिर्फ़ साइन इन लोगों से बढ़ती है, ताकि एक व्यक्ति तीन न बन सके। | |
| Sign in, so it counts | साइन इन करें, ताकि गिना जाए | |
| Signed in — this will count toward the badge. | साइन इन है — यह बैज के लिए गिना जाएगा। | |
| Recorded. Thank you. | दर्ज हो गया। धन्यवाद। | |
| You have already confirmed this one. | आप इसकी पुष्टि पहले ही कर चुके हैं। | |

### How far a record is from the badge

| English | हिन्दी | Note |
|---|---|---|
| Nobody has yet | अभी तक कोई नहीं | |
| {n} people | {n} लोग | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}। बैज के लिए {need} चाहिए, यानी {place} से जुड़े {people} इसे पूरा कर देंगे। | |

### An empty record

| English | हिन्दी | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | किसी ने नहीं लिखा कि {dish} कैसे बनाई जाती है। आप पहले व्यक्ति होंगे। | |
| Record how it’s made | दर्ज करें कि यह कैसे बनता है | |

### Proposing a dish

| English | हिन्दी | Note |
|---|---|---|
| Record a dish you know | जो व्यंजन आप जानते हैं उसे दर्ज करें | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | भेजने से यह प्रकाशित नहीं होता। पहले व्यंजन को जानने वाले {n} लोग इसकी पुष्टि करते हैं, और यह अपने प्रमाणों के अनुसार एटलस में आता है — ठीक वैसे ही जैसे यहाँ का हर रिकॉर्ड। | |

### The argument on /how

| English | हिन्दी | Note |
|---|---|---|
| The version recorded here | यहाँ दर्ज किया गया रूप | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | इन छह में से दो का उत्तर कोई भी लिखा हुआ दस्तावेज़ नहीं दे सकता: कोई विश्वकोश उस जगह का व्यक्ति नहीं होता। तीसरा, तकनीक, केवल वहाँ उत्तर पाता है जहाँ कोई धरोहर रजिस्टर संरक्षित उत्पादन विधि प्रकाशित करता है। इनके बिना कोई रिकॉर्ड प्रकाशित स्रोतों से अधिकतम {ceiling} तक पहुँचता है — ऐसा रजिस्टर हो तो {registered}। | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | किसी रिकॉर्ड को {threshold} पर प्रामाणिक कहा जाता है। इन दो संख्याओं की दूरी जान-बूझकर है, और यही पूरा तर्क है: इसे केवल वही लोग पाट सकते हैं जो उस व्यंजन को जानते हैं। | |

## 中文 (`zh`)

### The ask on every record

| English | 中文 | Note |
|---|---|---|
| Is this how it’s made where you’re from? | 你们那儿也是这么做的吗？ | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | 如果你就在这道菜的原产地做它，你的确认或更正正是让一条记录脱离未核实的东西。你的做法不同的地方，会记在这条旁边 — 而不是取代它。 | |
| Yes — this matches | 是的，一样 | |
| It’s made differently where I’m from | 我们那儿做法不一样 | |
| Is this dish from where we say it is? | 这道菜真的来自我们标注的地方吗？ | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | 没有人写下这一道怎么做，所以现在还没有可以认同的内容。地方是这条记录所主张的，光是这一点就值得确认 — 它是六项证据核查之一。 | |
| Yes — it’s from here | 是的，就是这儿的 | |
| No — it’s from somewhere else | 不是，来自别处 | |

### Confirming

| English | 中文 | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | 只确认你真正知道的。你不必为整条记录背书 — 一个做这道菜的人说出的一件具体的事，比笼统的赞同更有分量。 | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | 未登录。你写的内容会连同你与当地的关系显示在记录上，但不会推动徽章：那个数字只因登录的人而上升，这样一个人就不能顶三个人。 | |
| Sign in, so it counts | 登录，让它算数 | |
| Signed in — this will count toward the badge. | 已登录 — 这会计入徽章。 | |
| Recorded. Thank you. | 已记录。谢谢。 | |
| You have already confirmed this one. | 这一条你已经确认过了。 | |

### How far a record is from the badge

| English | 中文 | Note |
|---|---|---|
| Nobody has yet | 还没有人 | |
| {n} people | {n} 位 | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}。徽章需要 {need} 位，所以再有 {people} 位与{place}有关系的人就够了。 | |

### An empty record

| English | 中文 | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | 还没有人写下 {dish} 的做法。你会是第一个。 | |
| Record how it’s made | 记录它是怎么做的 | |

### Proposing a dish

| English | 中文 | Note |
|---|---|---|
| Record a dish you know | 记下你知道的一道菜 | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | 提交并不等于发布。先由 {n} 位了解这道菜的人确认，然后它按自身证据所值进入图谱 — 和这里其他记录一样。 | |

### The argument on /how

| English | 中文 | Note |
|---|---|---|
| The version recorded here | 这里记录的版本 | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | 这六项中有两项，任何写下来的文件都无法回答：百科全书不是当地的人。第三项“技法”，只有在遗产名录公布其保护的制作工艺时才能回答。这几项为空时，一条记录仅凭已发表的资料最多得 {ceiling} 分；有这样的名录时为 {registered} 分。 | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | 一条记录达到 {threshold} 才被称为正宗。这两个数字之间的距离是刻意的，也正是全部论点所在：只有了解这道菜的人才能把它补上。 | |

## 日本語 (`ja`)

### The ask on every record

| English | 日本語 | Note |
|---|---|---|
| Is this how it’s made where you’re from? | あなたの土地でも、こう作りますか。 | |
| If you cook this where it comes from, confirming or correcting it is what moves a record out of Unverified. Where your version differs, it is recorded alongside — not instead of — this one. | この料理の生まれた土地であなたが作っているなら、その確認や訂正こそが、記録を未確認から動かすものです。あなたのやり方が違うところは、この記録の代わりにではなく、隣に書き留めます。 | |
| Yes — this matches | はい、これで合っています | |
| It’s made differently where I’m from | うちの土地では作り方が違います | |
| Is this dish from where we say it is? | この料理は、こちらの示した土地のものですか。 | |
| Nobody has written down how this one is made, so there is nothing here to agree with yet. The place is what this record claims, and that is worth confirming on its own — it is one of the six evidence checks. | これがどう作られるかは誰も書き残していないので、まだ同意する対象がありません。土地はこの記録が主張していることであり、それだけでも確かめる値打ちがあります。六つの根拠の確認のひとつです。 | |
| Yes — it’s from here | はい、ここのものです | |
| No — it’s from somewhere else | いいえ、よその土地のものです | |

### Confirming

| English | 日本語 | Note |
|---|---|---|
| Confirm what you actually know. You do not have to vouch for the whole record — one specific thing from somebody who cooks it is worth more than general agreement. | 本当に知っていることだけを確認してください。記録の全体を保証する必要はありません。作っている人が挙げる具体的な一点は、全体としての同意より重みがあります。 | |
| Not signed in. What you write will be shown on the record with your connection, and it will not move the badge — that count only rises for signed-in people, so one person cannot be three of them. | サインインしていません。書いた内容はつながりとともに記録に表示されますが、印は動きません。その数はサインインした人の分しか増えないからで、一人が三人になれないようにするためです。 | |
| Sign in, so it counts | 数えられるようにサインインする | |
| Signed in — this will count toward the badge. | サインイン済みです。これは印に数えられます。 | |
| Recorded. Thank you. | 記録しました。ありがとうございます。 | |
| You have already confirmed this one. | これはすでに確認済みです。 | |

### How far a record is from the badge

| English | 日本語 | Note |
|---|---|---|
| Nobody has yet | まだ誰もいません | |
| {n} people | {n}人 | |
| {soFar}. The badge requires {need}, so {people} connected to {place} would meet it. | {soFar}。印には {need} 人が必要なので、{place}にゆかりのある{people}で届きます。 | |

### An empty record

| English | 日本語 | Note |
|---|---|---|
| Nobody has written down how {dish} is made. You would be the first. | {dish} の作り方は、まだ誰も書き残していません。あなたが最初の一人になります。 | |
| Record how it’s made | 作り方を記録する | |

### Proposing a dish

| English | 日本語 | Note |
|---|---|---|
| Record a dish you know | 知っている料理を記録する | |
| It is not published by sending it. {n} people who know the dish confirm it first, and it enters the atlas at whatever its evidence earns — the same way every other record here is judged. | 送っても公開はされません。まずその料理を知る {n} 人が確認し、根拠に見合っただけの評価でアトラスに入ります — ほかのすべての記録と同じです。 | |

### The argument on /how

| English | 日本語 | Note |
|---|---|---|
| The version recorded here | ここに記録されている作り方 | |
| Two of those six cannot be answered by any document ever written: no encyclopaedia is a person from the town. The third, technique, is answered only where a heritage register publishes the production method it protects. With them empty, a record scores at most {ceiling} on published sources — {registered} where such a register exists. | この六つのうち二つは、これまでに書かれたどの文書でも答えられません。百科事典はその土地の人ではないからです。三つ目の「技法」は、保護する製法を公開している遺産登録制度がある場合にのみ答えられます。これらが空のとき、記録が公開資料だけで達する上限は {ceiling} 点、そうした登録がある場合は {registered} 点です。 | |
| A record is called Authentic at {threshold}. The distance between those two numbers is deliberate, and it is the entire argument: it is closable only by people who know the dish. | 記録が本物と呼ばれるのは {threshold} からです。この二つの数字の隔たりは意図されたもので、それこそが論の全部です。埋められるのは、その料理を知る人だけです。 | |
