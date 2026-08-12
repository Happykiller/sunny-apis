// src\services\challenge\challenge.service.memory.ts
import { server } from '@passwordless-id/webauthn';

import { ChallengeService } from './challenge.service';

/** Durée de validité par défaut. Le `timeout` WebAuthn du navigateur est d'une
 *  minute, mais l'utilisateur peut hésiter devant le sélecteur de son
 *  gestionnaire, changer d'appareil, aller chercher son téléphone : cinq
 *  minutes couvrent le parcours réel sans laisser traîner l'occasion. */
const DUREE_MS = 5 * 60 * 1000;

/**
 * Implémentation par défaut, en mémoire du processus.
 *
 * Elle suffit à un service **mono-instance**, ce que sont les projets qui
 * consomment ce socle aujourd'hui. Deux limites à connaître avant de s'en
 * contenter : les challenges en vol sont perdus au redémarrage (l'utilisateur
 * n'a qu'à recommencer), et derrière plusieurs instances sans affinité de
 * session, un challenge émis par l'une ne sera pas reconnu par l'autre. Dans ce
 * cas, implémenter `ChallengeService` sur un stockage partagé — c'est
 * précisément pourquoi c'est une interface.
 *
 * Le choix d'un service plutôt que d'une table imposée à tous : le socle est
 * mutualisé, et aucun de ses consommateurs ne doit avoir à migrer sa base pour
 * recevoir un correctif de sécurité.
 */
export class ChallengeServiceMemory implements ChallengeService {
  private readonly emis = new Map<string, number>();

  constructor(private readonly dureeMs: number = DUREE_MS) {}

  async issue(): Promise<string> {
    this.purger();
    const challenge = server.randomChallenge();
    this.emis.set(challenge, Date.now() + this.dureeMs);
    return challenge;
  }

  async consume(challenge: string): Promise<boolean> {
    const expiration = this.emis.get(challenge);

    // Le retrait est inconditionnel : un challenge présenté est un challenge
    // brûlé, qu'il ait été accepté ou non. Sans cela, un attaquant pourrait
    // réessayer autant de fois qu'il veut sur le même.
    this.emis.delete(challenge);

    return expiration !== undefined && expiration > Date.now();
  }

  /** Purge paresseuse, à l'émission : sans elle, les challenges jamais
   *  consommés — l'utilisateur qui renonce, ferme l'onglet — s'accumuleraient
   *  sans fin. */
  private purger(): void {
    const maintenant = Date.now();
    for (const [challenge, expiration] of this.emis) {
      if (expiration <= maintenant) this.emis.delete(challenge);
    }
  }
}

/**
 * Le repli quand le projet consommateur ne câble pas `challengeService`.
 *
 * C'est un **singleton**, et il doit le rester : l'émission et la consommation
 * ont lieu dans deux usecases différents. Deux instances, et un challenge émis
 * par l'une serait systématiquement rejeté par l'autre — l'authentification ne
 * marcherait tout simplement jamais.
 */
export const challengeServiceParDefaut = new ChallengeServiceMemory();
