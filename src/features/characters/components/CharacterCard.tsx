import { memo } from "react";
import { Link } from "react-router-dom";
import { gql } from "@apollo/client";
import type { CharacterSummary } from "../types";
import { STATUS_DOT } from "../statusDot";
import { CARD_SURFACE, CHARACTER_CARD_SURFACE } from "../../../shared/styles";

// Colocated with the component so SEARCH_CHARACTERS (and any future query
// feeding a character grid) stays in sync with what this card renders.
export const CHARACTER_CARD_FIELDS = gql`
  fragment CharacterCardFields on Character {
    id
    name
    status
    species
    image
  }
`;

interface CharacterCardProps {
  character: CharacterSummary;
}

export const CharacterCard = memo(function CharacterCard({
  character,
}: CharacterCardProps) {
  return (
    <Link
      to={`/characters/${character.id}`}
      className={`group flex flex-col overflow-hidden ${character.name === "Rick Sanchez" ? CHARACTER_CARD_SURFACE : CARD_SURFACE}   transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="aspect-square w-full object-cover"
      />
      <div className="flex flex-col gap-1 p-3">
        <span className="truncate font-medium text-neutral-900 group-hover:text-emerald-700 dark:text-neutral-100 dark:group-hover:text-emerald-500">
          {character.name}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <span
            className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[character.status]}`}
          />
          {character.status} · {character.species}
        </span>
      </div>
    </Link>
  );
});
