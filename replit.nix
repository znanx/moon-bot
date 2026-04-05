{ pkgs }: {
    deps = [
        pkgs.nodejs_22
        pkgs.neofetch
        pkgs.jellyfin-ffmpeg
        pkgs.imagemagick
        pkgs.libwebp
        pkgs.yarn
        pkgs.libuuid
        pkgs.zip
    ];
    env = {
        LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
            pkgs.libuuid
        ];
    };
}