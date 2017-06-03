import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';

// below we're using bling selections to supply the arguments
// note this is all client-side
autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead($('.search'));

makeMap( $('#map') );
