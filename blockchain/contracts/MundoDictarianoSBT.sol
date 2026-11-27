// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * MundoDictarianoSBT
 * ------------------------------------------------------------------
 * Token "Soulbound" (no transferible) que representa un certificado
 * educativo de Mundo Dictariano.
 *
 * - Cada certificado = 1 token, propiedad del alumno (o de la wallet de la empresa).
 * - No se puede transferir ni vender (soulbound): cualquier intento
 *   de transferencia distinto de mint/burn revierte.
 * - Es revocable: el rol MINTER_ROLE (el backend de certificados)
 *   puede marcar un token como revocado sin necesidad de quemarlo,
 *   para conservar el historial pero invalidar la verificación.
 * - tokenURI apunta a los metadatos en IPFS (subidos vía Pinata).
 *
 * NOTA: este contrato es un punto de partida razonable para el caso
 * de uso descrito (certificados educativos no transferibles,
 * revocables por la institución emisora). Antes de desplegar a
 * mainnet/Polygon productivo, debe auditarse.
 */
contract MundoDictarianoSBT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId;

    // tokenId → URI de metadatos IPFS (ipfs://<cid>)
    mapping(uint256 => string) private _tokenURIs;

    // tokenId → estado de revocación
    mapping(uint256 => bool) public isRevoked;

    // tokenId => código del certificado en la base de datos.
    mapping(uint256 => string) public certificateId;

    event CertificateMinted(uint256 indexed tokenId, address indexed to, string certificateId, string tokenURI);
    event CertificateRevoked(uint256 indexed tokenId, string reason);
    event CertificateReissued(uint256 indexed oldTokenId, uint256 indexed newTokenId);

    constructor(address admin) ERC721("Mundo Dictariano Certificate", "MDCERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    /// Emite un nuevo certificado (llamado por el backend tras validar el curso)
    function mintCertificate(
        address to,
        string calldata certId,
        string calldata metadataURI
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = metadataURI;
        certificateId[tokenId] = certId;

        emit CertificateMinted(tokenId, to, certId, metadataURI);
        return tokenId;
    }

    /// Revoca un certificado (ej. por reembolso o fraude). No lo quema: queda visible como "revocado".
    function revoke(uint256 tokenId, string calldata reason) external onlyRole(MINTER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Token inexistente");
        isRevoked[tokenId] = true;
        emit CertificateRevoked(tokenId, reason);
    }

    /// Revierte una revocación (ej. reembolso disputado y resuelto a favor del usuario)
    function unrevoke(uint256 tokenId) external onlyRole(MINTER_ROLE) {
        isRevoked[tokenId] = false;
    }

    /// Reemisión: revoca el token anterior y mintea uno nuevo con datos corregidos
    function reissue(
        uint256 oldTokenId,
        address to,
        string calldata certId,
        string calldata newMetadataURI,
        string calldata reason
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        if (_ownerOf(oldTokenId) != address(0)) {
            isRevoked[oldTokenId] = true;
            emit CertificateRevoked(oldTokenId, reason);
        }
        uint256 newTokenId = _nextTokenId++;
        _safeMint(to, newTokenId);
        _tokenURIs[newTokenId] = newMetadataURI;
        certificateId[newTokenId] = certId;

        emit CertificateMinted(newTokenId, to, certId, newMetadataURI);
        emit CertificateReissued(oldTokenId, newTokenId);
        return newTokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    // ---- Soulbound: bloquea cualquier transferencia que no sea mint/burn ----
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("MundoDictarianoSBT: token no transferible (soulbound)");
        }
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
