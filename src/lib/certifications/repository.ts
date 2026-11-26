import manualInput from '../../data/certifications/manual.json';
import overrideInput from '../../data/certifications/overrides.json';
import platziInput from '../../data/certifications/platzi.json';
import {
  type Certification,
  sortCertifications,
  validateCertification,
  validateDataset,
  validateOverrides,
} from './schema';

const platzi = validateDataset(platziInput);
const manual = Array.isArray(manualInput)
  ? manualInput.map((credential, index) => validateCertification(credential, `manual[${index}]`))
  : [];
const overrides = validateOverrides(overrideInput);

export function getCertifications(): Certification[] {
  const ids = new Set<string>();
  const combined = [...platzi.credentials, ...manual].map((credential) => {
    if (ids.has(credential.id))
      throw new TypeError(`Duplicate credential id across sources: ${credential.id}`);
    ids.add(credential.id);
    const override = overrides[credential.id];
    return {
      ...credential,
      ...(override?.category ? { category: override.category } : {}),
      ...(override?.technologies ? { technologies: override.technologies } : {}),
      ...(override?.certificateUrl ? { certificateUrl: override.certificateUrl } : {}),
      ...(override?.verificationStatus ? { verificationStatus: override.verificationStatus } : {}),
      featured: override?.featured ?? credential.featured,
      hidden: override?.hidden ?? false,
    };
  });
  return sortCertifications(combined.filter((credential) => !credential.hidden));
}

export function getFeaturedCertifications(limit = 4): Certification[] {
  return getCertifications()
    .filter((credential) => credential.featured)
    .slice(0, limit);
}

export function getCertificationSummary() {
  return platzi.profileSummary;
}
