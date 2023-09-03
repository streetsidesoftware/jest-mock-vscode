export enum FileType {
    /**
     * The file type is unknown.
     */
    Unknown = 0,
    /**
     * A regular file.
     */
    File = 1,
    /**
     * A directory.
     */
    Directory = 2,
    /**
     * A symbolic link to a file.
     */
    SymbolicLink = 64,
}

export enum FilePermission {
    /**
     * The file is readonly.
     *
     * *Note:* All `FileStat` from a `FileSystemProvider` that is registered with
     * the option `isReadonly: true` will be implicitly handled as if `FilePermission.Readonly`
     * is set. As a consequence, it is not possible to have a readonly file system provider
     * registered where some `FileStat` are not readonly.
     */
    Readonly = 1,
}
