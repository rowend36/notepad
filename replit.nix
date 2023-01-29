{ pkgs }: {
  deps = [
    pkgs.nodejs-16_x
    pkgs.nodejs-16_x
    pkgs.edit
    pkgs.xsel
    pkgs.nodejs-16_x
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}