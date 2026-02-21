

## Corrections: Bug deconnexion + Logo Boussole Climat

### 1. Bug de deconnexion

**Probleme identifie** : En mode demo, la deconnexion appelle `signOut()` (auth Supabase) mais ne desactive pas le mode demo. Comme l'app verifie `isDemo || !!user`, le mode demo reste actif dans le localStorage et l'utilisateur reste "connecte".

**Correction** : Dans le composant `UserProfileBlock` (ClientSidebar.tsx), importer `useDemoIfAvailable` et appeler `demo.setEnabled(false)` avant `signOut()` + `navigate('/login')`. Cela garantit que le mode demo est desactive et que l'utilisateur est bien redirige vers la page login.

### 2. Restauration du logo Boussole Climat original

**Probleme** : Le logo actuel dans la sidebar est juste du texte "Boussole Climat" sans icone. L'utilisateur prefere la version originale avec l'icone boussole (cercle vert + icone Compass blanche).

**Correction dans la sidebar** (`ClientSidebar.tsx`) : Remettre le logo avec un petit cercle vert (#1B4332) contenant l'icone `Compass` de Lucide (14px, blanc) suivi du texte "Boussole Climat" en Fraunces, et en dessous "par Celsius" en petit texte uppercase.

**Fichiers modifies** :
- `src/components/layout/ClientSidebar.tsx` : fix logout + restauration logo

