// src\services\challenge\challenge.service.ts

/**
 * Émission et consommation des challenges WebAuthn.
 *
 * Un challenge doit être **émis par le serveur** et **valable une seule fois** :
 * c'est ce qui empêche qu'une assertion capturée soit rejouée. Jusqu'ici le
 * socle réutilisait celui figé en base à l'enregistrement, généré qui plus est
 * par le navigateur — une même assertion restait donc valide indéfiniment.
 *
 * Le contrat est volontairement minimal pour que l'implémentation par défaut
 * (en mémoire) suffise à un service mono-instance, et qu'un projet qui monte en
 * charge puisse brancher Redis ou sa base sans que le reste du socle bouge.
 */
export interface ChallengeService {
  /** Crée un challenge aléatoire, le mémorise, et le rend au client. */
  issue(): Promise<string>;

  /**
   * Vérifie qu'un challenge a bien été émis, n'est pas expiré, et **le retire**.
   * Rend `false` s'il est inconnu, périmé, ou déjà consommé — ces trois cas ne
   * se distinguent pas volontairement, le client n'a pas à savoir lequel.
   */
  consume(challenge: string): Promise<boolean>;
}
