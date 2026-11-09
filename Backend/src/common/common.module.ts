import { Module } from '@nestjs/common';

/**
 * Common module grouping shared, cross-cutting primitives (pagination DTOs,
 * base entities, shared enums). These types are imported directly where
 * needed; this module exists so shared injectable providers can be registered
 * here as the codebase grows.
 */
@Module({})
export class CommonModule {}
