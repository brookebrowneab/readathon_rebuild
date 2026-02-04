# Read-a-thon Complete Project Documentation

## Purpose

This directory contains the **complete read-a-thon platform project** including legacy system analysis, visual design system, and modern rebuild specifications. All documentation needed for implementation is centralized here.

**Project Structure**:
- `spec/` - Legacy system analysis and visual invariants
- `spec-v2/` - Modern rebuild specifications 
- `design/` - Complete visual design system and implementation guide

## Legacy System Documentation

The following documents analyze and explain how the current production system works:

### Current System Analysis
1. [**01_scope.md**](01_scope.md) - System boundaries, core functionality, and technical constraints
2. [**02_user_roles.md**](02_user_roles.md) - User types, characteristics, and role definitions
3. [**03_user_flows.md**](03_user_flows.md) - End-to-end user interaction patterns and workflows
4. [**04_data_dictionary.md**](04_data_dictionary.md) - Complete database schema, entities, and relationships
5. [**05_permissions_matrix.md**](05_permissions_matrix.md) - Role-based access control and authorization rules
6. [**07_payments_square.md**](07_payments_square.md) - Square payment integration specifications and flow

### Business Requirements & Questions
- [**open_questions.md**](open_questions.md) - Outstanding questions needing stakeholder input

### Visual Invariants
- [**22_visual_invariants.md**](22_visual_invariants.md) - Non-negotiable design elements that must be preserved exactly

### Modern Rebuild Specifications
**Location**: `../spec-v2/`
- [**30_architecture_proposal.md**](../spec-v2/30_architecture_proposal.md) - Overall system design
- [**31_domain_model.md**](../spec-v2/31_domain_model.md) - Data models and relationships
- [**34_inertia_pages_and_routes.md**](../spec-v2/34_inertia_pages_and_routes.md) - Complete page structure
- [**40_development_phases.md**](../spec-v2/40_development_phases.md) - Implementation timeline

### Visual Design System
**Location**: `../design/`
- [**legacy-motifs/**](../design/legacy-motifs/) - Extracted visual elements that must be preserved
- [**style-extensions/**](../design/style-extensions/) - Modern styling guidelines (7 files)
- [**tokens.md**](../design/tokens.md) - Design tokens and color system
- [**visual-hierarchy.md**](../design/visual-hierarchy.md) - Component hierarchy rules
- [**implementation-guide.md**](../design/implementation-guide.md) - Complete code examples

## Key Legacy Decisions (Preserved in v2)

The following decisions are carried forward from the legacy system:

- **Payment Processor**: Square API is the exclusive payment processing platform
- **Payment Authorization**: Only adults can make payments (no child payment accounts)
- **Child Account Management**: All child/student accounts are parent-managed
- **Database System**: MySQL/MariaDB for all persistent data storage
- **Compliance Requirements**: Full GDPR and COPPA compliance is mandatory

## Legacy Technology Stack

The current production system uses:
- **Backend**: PHP (procedural, no framework)
- **Database**: MySQL with custom schema
- **Frontend**: PHP-generated HTML with jQuery
- **Hosting**: SiteGround shared hosting
- **Payments**: Square API integration

## Relationship to v2 Project

This legacy analysis informs the v2 rebuild by:

✅ **Understanding Current Functionality**: What features exist and how they work  
✅ **Identifying Business Rules**: Complex logic that must be preserved  
✅ **Data Migration Planning**: How to move historical data safely  
✅ **User Workflow Analysis**: Existing patterns users are familiar with  
✅ **Compliance Requirements**: Current privacy and security implementations  

## Migration Context

- **Data Preservation**: All historical reading logs, pledges, and user data must be migrated
- **Functional Parity**: v2 must support all current legacy functionality  
- **User Training**: Changes should be evolutionary, not revolutionary
- **School Calendar**: Migration must align with school operational schedule

## Getting Started

### For Legacy Analysis
1. **Understand Current System**: Start with `01_scope.md` for overview
2. **Review User Workflows**: See `03_user_flows.md` for key processes
3. **Study Data Model**: Review `04_data_dictionary.md` for data structures

### For Modern Development
1. **System Architecture**: Review `../spec-v2/30_architecture_proposal.md`
2. **Visual Design**: Study `../design/implementation-guide.md` for complete code
3. **Page Structure**: See `../spec-v2/34_inertia_pages_and_routes.md` for all pages
4. **Development Plan**: Follow `../spec-v2/40_development_phases.md` timeline

### For Design Implementation
1. **Visual Motifs**: Preserve exact specifications in `../design/legacy-motifs/`
2. **Style Extensions**: Apply modern aesthetics from `../design/style-extensions/`
3. **Component Hierarchy**: Follow `../design/visual-hierarchy.md` for styling priority
4. **Design Tokens**: Use `../design/tokens.md` for consistent theming

The legacy system serves elementary schools for their annual read-a-thon fundraising events. While functional, it requires manual administration and lacks modern security and user experience standards that the v2 rebuild will address.