interface TableListAction {
    key: string,
    label: string;
    icon: string;
    styles?: {
        button: string;
        icon: string;
    },
    show?: (subject: unknown) => boolean
}

export { TableListAction };
