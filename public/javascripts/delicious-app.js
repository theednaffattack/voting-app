import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';

// below we're using bling selections to supply the arguments
// note this is all client-side
autocomplete($('#address'), $('#lat'), $('#lng'));
