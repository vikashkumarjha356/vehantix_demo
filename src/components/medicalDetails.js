import { medicalDetails } from '../data/mockData.js';
import { formatDate, formatCurrency } from '../utils/animations.js';

export function renderMedicalDetails() {
  const container = document.getElementById('section-medical');

  const allergyTags = medicalDetails.allergies
    .map((a) => `<span class="medical-tag">${a}</span>`)
    .join('');

  const conditionTags = medicalDetails.medicalConditions
    .map((c) => `<span class="medical-tag">${c}</span>`)
    .join('');

  const medicationTags = medicalDetails.medications
    .map((m) => `<span class="medical-tag">${m}</span>`)
    .join('');

  const ins = medicalDetails.healthInsurance;
  const memberTags = ins.members
    .map((m) => `<span class="medical-tag medical-tag--teal">${m}</span>`)
    .join('');

  container.innerHTML = `
    <div class="section-header animate-on-scroll">
      <div>
        <span class="section-header__label">HEALTH</span>
        <h2 class="section-header__title">Medical Details</h2>
      </div>
    </div>

    <div class="medical-cards-grid">
      <div class="card card--no-hover animate-on-scroll stagger-1">
        <div class="medical-grid">
          <div class="blood-group-badge">${medicalDetails.bloodGroup}</div>
          <div class="medical-info">
            <div class="medical-info__row">
              <span class="medical-info__label">Blood Group</span>
              <span class="medical-info__value">${medicalDetails.bloodGroup}</span>
            </div>
            <div class="medical-info__row">
              <span class="medical-info__label">Allergies</span>
              <div class="medical-tags">${allergyTags}</div>
            </div>
            <div class="medical-info__row">
              <span class="medical-info__label">Medical Conditions</span>
              <div class="medical-tags">${conditionTags}</div>
            </div>
            <div class="medical-info__row">
              <span class="medical-info__label">Medications</span>
              <div class="medical-tags">${medicationTags}</div>
            </div>
            ${
              medicalDetails.organDonor
                ? '<div class="organ-donor-badge">💚 Registered Organ Donor</div>'
                : ''
            }
            <div class="medical-info__row">
              <span class="medical-info__label">Emergency Notes</span>
              <span class="medical-info__value">${medicalDetails.emergencyNotes}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card card--no-hover card--insurance animate-on-scroll stagger-2">
        <div class="insurance-card">
          <div class="insurance-card__header">
            <div class="insurance-card__icon">🏥</div>
            <div>
              <div class="insurance-card__title">Health Insurance</div>
              <div class="insurance-card__provider">${ins.provider}</div>
            </div>
            <span class="badge badge--success" style="margin-left:auto; font-size:10px;">Active</span>
          </div>
          <div class="insurance-card__body">
            <div class="insurance-card__row">
              <span class="insurance-card__label">Plan</span>
              <span class="insurance-card__value">${ins.planName}</span>
            </div>
            <div class="insurance-card__row">
              <span class="insurance-card__label">Policy No.</span>
              <span class="insurance-card__value insurance-card__value--mono">${ins.policyNumber}</span>
            </div>
            <div class="insurance-card__row-group">
              <div class="insurance-card__row">
                <span class="insurance-card__label">Sum Insured</span>
                <span class="insurance-card__value insurance-card__value--highlight">${formatCurrency(ins.sumInsured)}</span>
              </div>
              <div class="insurance-card__row">
                <span class="insurance-card__label">Cover Type</span>
                <span class="insurance-card__value">${ins.coverType}</span>
              </div>
            </div>
            <div class="insurance-card__row">
              <span class="insurance-card__label">Validity</span>
              <span class="insurance-card__value">📅 ${formatDate(ins.validFrom)} — ${formatDate(ins.validTo)}</span>
            </div>
            <div class="insurance-card__row">
              <span class="insurance-card__label">Covered Members</span>
              <div class="medical-tags">${memberTags}</div>
            </div>
            <div class="insurance-card__row">
              <span class="insurance-card__label">Helpline</span>
              <span class="insurance-card__value">
                <a href="tel:${ins.contactNo}" class="insurance-card__phone">📞 ${ins.contactNo}</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
