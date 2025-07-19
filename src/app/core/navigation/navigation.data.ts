import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from './navigation.types';

const navigationItems: FuseNavigationItem[] = [
    {
        id: 'clients',
        title: 'Clients',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/clients'
    },
    {
        id: 'shipments',
        title: 'Expéditions',
        type: 'basic',
        icon: 'heroicons_outline:truck',
        link: '/shipments'
    },
    // {
    //     id: 'packages',
    //     title: 'Colis',
    //     type: 'basic',
    //     icon: 'heroicons_outline:cube',
    //     link: '/packages'
    // }
];

export default {
    default: [...navigationItems],
    horizontal: [...navigationItems],
    futuristic: [],
    compact: []
} as Navigation;
