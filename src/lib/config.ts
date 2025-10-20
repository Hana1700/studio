/**
 * @fileoverview This file contains the application-wide configuration.
 * You can define constants and settings here that can be used across the application.
 */

/**
 * Defines the sorting order for contact titles (grades) in search results.
 * Contacts with titles appearing earlier in this array will be shown first.
 * Titles not in this array will appear after the sorted ones.
 */
export const GRADE_ORDER: string[] = [
  "Chef de service",
  "Adjoint au chef de service",
  "Secrétaire",
  "Chef de département",
  "Responsable",
  // Add other grades/titles here in the desired order of priority
];
