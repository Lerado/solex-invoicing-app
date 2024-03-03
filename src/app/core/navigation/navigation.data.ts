import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from './navigation.types';

const navigationItems: FuseNavigationItem[] = [
    {
        id: 'shipments',
        title: 'Expéditions', // cspell:disable-line
        type: 'basic',
        icon: 'heroicons_outline:truck',
        link: '/shipments'
    },
    {
        id: 'packages',
        title: 'Colis', // cspell:disable-line
        type: 'basic',
        icon: 'heroicons_outline:cube',
        link: '/packages'
    }
];

export default {
    default: [...navigationItems],
    horizontal: [...navigationItems],
    futuristic: [],
    compact: []
} as Navigation;
