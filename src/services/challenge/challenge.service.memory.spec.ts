// src\services\challenge\challenge.service.memory.spec.ts
import { describe, expect, it } from '@jest/globals';

import { ChallengeServiceMemory } from '@services/challenge/challenge.service.memory';

/**
 * Ce que ces tests verrouillent : **un challenge ne sert qu'une fois**.
 *
 * C'est la propriété qui empêche le rejeu d'une assertion WebAuthn capturée.
 * Avant l'introduction de ce service, le challenge était celui figé en base à
 * l'enregistrement : constant pour la durée de vie de la passkey, donc
 * rejouable indéfiniment.
 */
describe('ChallengeServiceMemory', () => {
  it('émet des challenges tous différents', async () => {
    const service = new ChallengeServiceMemory();

    const challenges = new Set(
      await Promise.all([service.issue(), service.issue(), service.issue()]),
    );

    expect(challenges.size).toBe(3);
  });

  it('accepte un challenge émis', async () => {
    const service = new ChallengeServiceMemory();

    const challenge = await service.issue();

    await expect(service.consume(challenge)).resolves.toBe(true);
  });

  it('refuse le même challenge une seconde fois', async () => {
    // Le cœur du sujet : c'est ce refus qui rend une assertion capturée
    // inutilisable.
    const service = new ChallengeServiceMemory();
    const challenge = await service.issue();

    await service.consume(challenge);

    await expect(service.consume(challenge)).resolves.toBe(false);
  });

  it('refuse un challenge jamais émis', async () => {
    const service = new ChallengeServiceMemory();

    await expect(service.consume('inventé')).resolves.toBe(false);
  });

  it('refuse un challenge expiré', async () => {
    // Durée nulle : le challenge est périmé à l'instant même où il est rendu.
    const service = new ChallengeServiceMemory(0);
    const challenge = await service.issue();

    await expect(service.consume(challenge)).resolves.toBe(false);
  });

  it('brûle un challenge même quand il est refusé', async () => {
    // Un challenge présenté est un challenge consommé, valide ou non : sinon un
    // attaquant réessaierait indéfiniment sur le même.
    const service = new ChallengeServiceMemory(0);
    const challenge = await service.issue();

    await service.consume(challenge);

    const frais = new ChallengeServiceMemory();
    await expect(frais.consume(challenge)).resolves.toBe(false);
  });

  it('ne garde pas les challenges que personne ne consomme', async () => {
    // Purge paresseuse : sans elle, chaque utilisateur qui renonce laisserait
    // une entrée derrière lui.
    const service = new ChallengeServiceMemory(0);
    const abandonne = await service.issue();
    await service.issue();

    const emis = service['emis'] as Map<string, number>;

    expect(emis.has(abandonne)).toBe(false);
  });
});
