interface Scripts {
    name: string;
    src: string;
}

export const ScriptStore: Scripts[] = [
    { name: "jquery", src: "https://code.jquery.com/jquery-3.2.1.slim.min.js" },
    {
        name: "popper",
        src: "https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js",
    },
    {
        name: "bootstrap",
        src: "https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js",
    },
];
