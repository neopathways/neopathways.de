import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const DentalTherapyScalarFieldEnumSchema = z.enum(['uid','teeth','type','description','notes','sha512','created','updated']);

export const LocationScalarFieldEnumSchema = z.enum(['uid','ip','latitude','longitude','altitude','accuracy','altitudeAccuracy','heading','speed','continent_code','continent_name','country_code','country_name','subdivision_code','subdivision_name','city_name','postal_code','timezone','address','notes','sha512']);

export const MaterialScalarFieldEnumSchema = z.enum(['uid','name','description','longdescription','type','url','weight','price','currency','sha512','manufacturer','created','updated','useruid']);

export const MerchantScalarFieldEnumSchema = z.enum(['uid','name','locationRef','contact','website','notes','sha512','created','updated']);

export const OrganizationMemberScalarFieldEnumSchema = z.enum(['uid','useruid','orguid','created','role']);

export const OrganizationScalarFieldEnumSchema = z.enum(['uid','name','ownerId','created','updated','description','redirecturl']);

export const UserRecordScalarFieldEnumSchema = z.enum(['uid','created','updated','outdated','category','tags','data','accuracy','useruid','orguid']);

export const OverallCollectedAccuracyScalarFieldEnumSchema = z.enum(['uid','useruid','orguid','accuracy','created']);

export const UploadScalarFieldEnumSchema = z.enum(['uid','filename','description','mimetype','encoding','useruid','orguid','created']);

export const OAuthRefreshTokenScalarFieldEnumSchema = z.enum(['uid','token','useruid','orguid','created','validUntil']);

export const OAuthConnectionScalarFieldEnumSchema = z.enum(['uid','useruid','orguid','created','updated','scopes']);

export const RefreshTokenScalarFieldEnumSchema = z.enum(['uid','token','useruid','created','validUntil','ip','agent']);

export const TransactionScalarFieldEnumSchema = z.enum(['uid','date','type','description','category','tags','merchantRef','amount','currency','tax','taxIncluded','accuracy','data','notes','sha512','useruid','created','updated']);

export const UserScalarFieldEnumSchema = z.enum(['uid','email','firstname','lastname','password','created','updated']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const OrganizationRoleSchema = z.enum(['ADMIN','MEMBER','MODERATOR','OWNER']);

export type OrganizationRoleType = `${z.infer<typeof OrganizationRoleSchema>}`

export const RecordCategorySchema = z.enum(['IDENTIFICATION','BIOGRAPHICAL','DEMOGRAPHIC','MEDICAL','FINANCIAL','ONLINE_ACTIVITY','BEHAVIORAL','PREFERENCES','LOCATION','BIOMETRIC','LEGAL','PSYCHOLOGICAL','INTERESTS','COMMUNICATION','INTERACTION','OTHER']);

export type RecordCategoryType = `${z.infer<typeof RecordCategorySchema>}`

export const RecordTagSchema = z.enum(['SCAN','IMAGE','FACE','FINGERPRINT','VOICEPRINT','IRIS','TEXT','VOICE','VIDEO','LOCATION','CONTACT','EMAIL','MESSAGE','CHAT','VOICECALL','VIDEOCALL','VIDEOCONFERENCE','DOCUMENT','FORM','QUESTIONNAIRE','APPLICATION','TRANSACTION','CONTRACT','AGREEMENT','PERMISSION','CONSENT','APPROVAL','CONFIRMATION','VERIFICATION','VALIDATION','OTHER','DENTAL']);

export type RecordTagType = `${z.infer<typeof RecordTagSchema>}`

export const ScopeSchema = z.enum(['READ','WRITE','DELETE','FULL','LOCATION_READ','LOCATION_WRITE','LOCATION_DELETE','LOCATION_FULL']);

export type ScopeType = `${z.infer<typeof ScopeSchema>}`

export const TransactionTypeSchema = z.enum(['CREDIT','DEBIT','TRANSFER','PAYMENT','WITHDRAWAL','DEPOSIT']);

export type TransactionTypeType = `${z.infer<typeof TransactionTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// DENTAL THERAPY SCHEMA
/////////////////////////////////////////

export const DentalTherapySchema = z.object({
  uid: z.string().cuid(),
  teeth: z.number().min(11).max(48).array(),
  type: z.string(),
  description: z.string().nullable(),
  notes: z.string().nullable(),
  sha512: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
})

export type DentalTherapy = z.infer<typeof DentalTherapySchema>

// DENTAL THERAPY RELATION SCHEMA
//------------------------------------------------------

export type DentalTherapyRelations = {
  materialsUsed: MaterialWithRelations[];
  transactions: TransactionWithRelations[];
};

export type DentalTherapyWithRelations = z.infer<typeof DentalTherapySchema> & DentalTherapyRelations

export const DentalTherapyWithRelationsSchema: z.ZodType<DentalTherapyWithRelations> = DentalTherapySchema.merge(z.object({
  materialsUsed: z.lazy(() => MaterialWithRelationsSchema).array(),
  transactions: z.lazy(() => TransactionWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// LOCATION SCHEMA
/////////////////////////////////////////

export const LocationSchema = z.object({
  uid: z.string().cuid(),
  ip: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().nullable(),
  accuracy: z.number().nullable(),
  altitudeAccuracy: z.number().nullable(),
  heading: z.number().nullable(),
  speed: z.number().nullable(),
  continent_code: z.string().nullable(),
  continent_name: z.string().nullable(),
  country_code: z.string().nullable(),
  country_name: z.string().nullable(),
  subdivision_code: z.string().nullable(),
  subdivision_name: z.string().nullable(),
  city_name: z.string().nullable(),
  postal_code: z.string().nullable(),
  timezone: z.string().nullable(),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  sha512: z.string(),
})

export type Location = z.infer<typeof LocationSchema>

// LOCATION RELATION SCHEMA
//------------------------------------------------------

export type LocationRelations = {
  Merchant: MerchantWithRelations[];
};

export type LocationWithRelations = z.infer<typeof LocationSchema> & LocationRelations

export const LocationWithRelationsSchema: z.ZodType<LocationWithRelations> = LocationSchema.merge(z.object({
  Merchant: z.lazy(() => MerchantWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// MATERIAL SCHEMA
/////////////////////////////////////////

export const MaterialSchema = z.object({
  /**
   * The unique identifier for the material
   */
  uid: z.string().cuid(),
  /**
   * The name of the material
   */
  name: z.string(),
  /**
   * The description of the material
   */
  description: z.string().nullable(),
  /**
   * The long description of the material as markdown
   */
  longdescription: z.string().nullable(),
  /**
   * The type of the material
   */
  type: z.string().nullable(),
  /**
   * A reference URL to the material
   */
  url: z.string().nullable(),
  /**
   * The weight of the material
   */
  weight: z.number().nullable(),
  /**
   * The price of the material
   */
  price: z.number().nullable(),
  /**
   * The currency of the price
   */
  currency: z.string().nullable(),
  /**
   * The unique hash of the material to enable dedup
   */
  sha512: z.string(),
  /**
   * The material's manufacturer
   */
  manufacturer: z.string().nullable(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  useruid: z.string().nullable(),
})

export type Material = z.infer<typeof MaterialSchema>

// MATERIAL RELATION SCHEMA
//------------------------------------------------------

export type MaterialRelations = {
  user?: UserWithRelations | null;
  DentalTherapy: DentalTherapyWithRelations[];
};

export type MaterialWithRelations = z.infer<typeof MaterialSchema> & MaterialRelations

export const MaterialWithRelationsSchema: z.ZodType<MaterialWithRelations> = MaterialSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema).nullable(),
  DentalTherapy: z.lazy(() => DentalTherapyWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// MERCHANT SCHEMA
/////////////////////////////////////////

export const MerchantSchema = z.object({
  uid: z.string().cuid(),
  name: z.string(),
  locationRef: z.string().nullable(),
  contact: z.string().nullable(),
  website: z.string().nullable(),
  notes: z.string().nullable(),
  sha512: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
})

export type Merchant = z.infer<typeof MerchantSchema>

// MERCHANT RELATION SCHEMA
//------------------------------------------------------

export type MerchantRelations = {
  location?: LocationWithRelations | null;
  Transactions: TransactionWithRelations[];
};

export type MerchantWithRelations = z.infer<typeof MerchantSchema> & MerchantRelations

export const MerchantWithRelationsSchema: z.ZodType<MerchantWithRelations> = MerchantSchema.merge(z.object({
  location: z.lazy(() => LocationWithRelationsSchema).nullable(),
  Transactions: z.lazy(() => TransactionWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ORGANIZATION MEMBER SCHEMA
/////////////////////////////////////////

export const OrganizationMemberSchema = z.object({
  role: OrganizationRoleSchema,
  uid: z.string().cuid(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date(),
})

export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>

// ORGANIZATION MEMBER RELATION SCHEMA
//------------------------------------------------------

export type OrganizationMemberRelations = {
  user: UserWithRelations;
  organization: OrganizationWithRelations;
};

export type OrganizationMemberWithRelations = z.infer<typeof OrganizationMemberSchema> & OrganizationMemberRelations

export const OrganizationMemberWithRelationsSchema: z.ZodType<OrganizationMemberWithRelations> = OrganizationMemberSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
}))

/////////////////////////////////////////
// ORGANIZATION SCHEMA
/////////////////////////////////////////

export const OrganizationSchema = z.object({
  uid: z.string().cuid(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  description: z.string().nullable(),
  redirecturl: z.string(),
})

export type Organization = z.infer<typeof OrganizationSchema>

// ORGANIZATION RELATION SCHEMA
//------------------------------------------------------

export type OrganizationRelations = {
  owner: UserWithRelations;
  members: OrganizationMemberWithRelations[];
  ProvidedRecords: UserRecordWithRelations[];
  Uploads: UploadWithRelations[];
  oAuthConnections: oAuthConnectionWithRelations[];
  oAuthRefreshTokens: oAuthRefreshTokenWithRelations[];
  OverallCollectedAccuracies: OverallCollectedAccuracyWithRelations[];
};

export type OrganizationWithRelations = z.infer<typeof OrganizationSchema> & OrganizationRelations

export const OrganizationWithRelationsSchema: z.ZodType<OrganizationWithRelations> = OrganizationSchema.merge(z.object({
  owner: z.lazy(() => UserWithRelationsSchema),
  members: z.lazy(() => OrganizationMemberWithRelationsSchema).array(),
  ProvidedRecords: z.lazy(() => UserRecordWithRelationsSchema).array(),
  Uploads: z.lazy(() => UploadWithRelationsSchema).array(),
  oAuthConnections: z.lazy(() => oAuthConnectionWithRelationsSchema).array(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenWithRelationsSchema).array(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER RECORD SCHEMA
/////////////////////////////////////////

export const UserRecordSchema = z.object({
  category: RecordCategorySchema,
  tags: RecordTagSchema.array(),
  uid: z.string().cuid(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  outdated: z.boolean(),
  data: JsonValueSchema,
  accuracy: z.number(),
  useruid: z.string(),
  orguid: z.string(),
})

export type UserRecord = z.infer<typeof UserRecordSchema>

// USER RECORD RELATION SCHEMA
//------------------------------------------------------

export type UserRecordRelations = {
  user: UserWithRelations;
  organization: OrganizationWithRelations;
};

export type UserRecordWithRelations = z.infer<typeof UserRecordSchema> & UserRecordRelations

export const UserRecordWithRelationsSchema: z.ZodType<UserRecordWithRelations> = UserRecordSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
}))

/////////////////////////////////////////
// OVERALL COLLECTED ACCURACY SCHEMA
/////////////////////////////////////////

export const OverallCollectedAccuracySchema = z.object({
  uid: z.string().cuid(),
  useruid: z.string(),
  orguid: z.string(),
  accuracy: z.number(),
  created: z.coerce.date(),
})

export type OverallCollectedAccuracy = z.infer<typeof OverallCollectedAccuracySchema>

// OVERALL COLLECTED ACCURACY RELATION SCHEMA
//------------------------------------------------------

export type OverallCollectedAccuracyRelations = {
  user: UserWithRelations;
  organization: OrganizationWithRelations;
};

export type OverallCollectedAccuracyWithRelations = z.infer<typeof OverallCollectedAccuracySchema> & OverallCollectedAccuracyRelations

export const OverallCollectedAccuracyWithRelationsSchema: z.ZodType<OverallCollectedAccuracyWithRelations> = OverallCollectedAccuracySchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
}))

/////////////////////////////////////////
// UPLOAD SCHEMA
/////////////////////////////////////////

export const UploadSchema = z.object({
  uid: z.string().cuid(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date(),
})

export type Upload = z.infer<typeof UploadSchema>

// UPLOAD RELATION SCHEMA
//------------------------------------------------------

export type UploadRelations = {
  user: UserWithRelations;
  organization: OrganizationWithRelations;
};

export type UploadWithRelations = z.infer<typeof UploadSchema> & UploadRelations

export const UploadWithRelationsSchema: z.ZodType<UploadWithRelations> = UploadSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
}))

/////////////////////////////////////////
// O AUTH REFRESH TOKEN SCHEMA
/////////////////////////////////////////

export const oAuthRefreshTokenSchema = z.object({
  uid: z.string().cuid(),
  token: z.string(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date(),
  validUntil: z.coerce.date(),
})

export type oAuthRefreshToken = z.infer<typeof oAuthRefreshTokenSchema>

// O AUTH REFRESH TOKEN RELATION SCHEMA
//------------------------------------------------------

export type oAuthRefreshTokenRelations = {
  user: UserWithRelations;
  organization: OrganizationWithRelations;
};

export type oAuthRefreshTokenWithRelations = z.infer<typeof oAuthRefreshTokenSchema> & oAuthRefreshTokenRelations

export const oAuthRefreshTokenWithRelationsSchema: z.ZodType<oAuthRefreshTokenWithRelations> = oAuthRefreshTokenSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
}))

/////////////////////////////////////////
// O AUTH CONNECTION SCHEMA
/////////////////////////////////////////

export const oAuthConnectionSchema = z.object({
  uid: z.string().cuid(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
  scopes: z.string().array(),
})

export type oAuthConnection = z.infer<typeof oAuthConnectionSchema>

// O AUTH CONNECTION RELATION SCHEMA
//------------------------------------------------------

export type oAuthConnectionRelations = {
  user: UserWithRelations;
  organization: OrganizationWithRelations;
};

export type oAuthConnectionWithRelations = z.infer<typeof oAuthConnectionSchema> & oAuthConnectionRelations

export const oAuthConnectionWithRelationsSchema: z.ZodType<oAuthConnectionWithRelations> = oAuthConnectionSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  organization: z.lazy(() => OrganizationWithRelationsSchema),
}))

/////////////////////////////////////////
// REFRESH TOKEN SCHEMA
/////////////////////////////////////////

export const RefreshTokenSchema = z.object({
  uid: z.string().cuid(),
  token: z.string(),
  useruid: z.string(),
  created: z.coerce.date(),
  validUntil: z.coerce.date(),
  ip: z.string().nullable(),
  agent: z.string().nullable(),
})

export type RefreshToken = z.infer<typeof RefreshTokenSchema>

// REFRESH TOKEN RELATION SCHEMA
//------------------------------------------------------

export type RefreshTokenRelations = {
  user: UserWithRelations;
};

export type RefreshTokenWithRelations = z.infer<typeof RefreshTokenSchema> & RefreshTokenRelations

export const RefreshTokenWithRelationsSchema: z.ZodType<RefreshTokenWithRelations> = RefreshTokenSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// TRANSACTION SCHEMA
/////////////////////////////////////////

export const TransactionSchema = z.object({
  type: TransactionTypeSchema,
  uid: z.string().cuid(),
  date: z.coerce.date(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  tags: z.string().array(),
  merchantRef: z.string().nullable(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().nullable(),
  taxIncluded: z.boolean().nullable(),
  accuracy: z.number().nullable(),
  data: JsonValueSchema.nullable(),
  notes: z.string().nullable(),
  sha512: z.string().nullable(),
  useruid: z.string().nullable(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
})

export type Transaction = z.infer<typeof TransactionSchema>

// TRANSACTION RELATION SCHEMA
//------------------------------------------------------

export type TransactionRelations = {
  merchant?: MerchantWithRelations | null;
  user?: UserWithRelations | null;
  DentalTherapies: DentalTherapyWithRelations[];
};

export type TransactionWithRelations = Omit<z.infer<typeof TransactionSchema>, "data"> & {
  data?: JsonValueType | null;
} & TransactionRelations

export const TransactionWithRelationsSchema: z.ZodType<TransactionWithRelations> = TransactionSchema.merge(z.object({
  merchant: z.lazy(() => MerchantWithRelationsSchema).nullable(),
  user: z.lazy(() => UserWithRelationsSchema).nullable(),
  DentalTherapies: z.lazy(() => DentalTherapyWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  uid: z.string().cuid(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date(),
  updated: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  RefreshTokens: RefreshTokenWithRelations[];
  oAuthRefreshTokens: oAuthRefreshTokenWithRelations[];
  Organizations: OrganizationWithRelations[];
  OrganizationMemberOf: OrganizationMemberWithRelations[];
  Records: UserRecordWithRelations[];
  Uploads: UploadWithRelations[];
  oAuthConnections: oAuthConnectionWithRelations[];
  OverallCollectedAccuracies: OverallCollectedAccuracyWithRelations[];
  Materials: MaterialWithRelations[];
  Transaction: TransactionWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  RefreshTokens: z.lazy(() => RefreshTokenWithRelationsSchema).array(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenWithRelationsSchema).array(),
  Organizations: z.lazy(() => OrganizationWithRelationsSchema).array(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberWithRelationsSchema).array(),
  Records: z.lazy(() => UserRecordWithRelationsSchema).array(),
  Uploads: z.lazy(() => UploadWithRelationsSchema).array(),
  oAuthConnections: z.lazy(() => oAuthConnectionWithRelationsSchema).array(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyWithRelationsSchema).array(),
  Materials: z.lazy(() => MaterialWithRelationsSchema).array(),
  Transaction: z.lazy(() => TransactionWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// DENTAL THERAPY
//------------------------------------------------------

export const DentalTherapyIncludeSchema: z.ZodType<Prisma.DentalTherapyInclude> = z.object({
  materialsUsed: z.union([z.boolean(),z.lazy(() => MaterialFindManyArgsSchema)]).optional(),
  transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DentalTherapyCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DentalTherapyArgsSchema: z.ZodType<Prisma.DentalTherapyDefaultArgs> = z.object({
  select: z.lazy(() => DentalTherapySelectSchema).optional(),
  include: z.lazy(() => DentalTherapyIncludeSchema).optional(),
}).strict();

export const DentalTherapyCountOutputTypeArgsSchema: z.ZodType<Prisma.DentalTherapyCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DentalTherapyCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DentalTherapyCountOutputTypeSelectSchema: z.ZodType<Prisma.DentalTherapyCountOutputTypeSelect> = z.object({
  materialsUsed: z.boolean().optional(),
  transactions: z.boolean().optional(),
}).strict();

export const DentalTherapySelectSchema: z.ZodType<Prisma.DentalTherapySelect> = z.object({
  uid: z.boolean().optional(),
  teeth: z.boolean().optional(),
  type: z.boolean().optional(),
  description: z.boolean().optional(),
  notes: z.boolean().optional(),
  sha512: z.boolean().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  materialsUsed: z.union([z.boolean(),z.lazy(() => MaterialFindManyArgsSchema)]).optional(),
  transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DentalTherapyCountOutputTypeArgsSchema)]).optional(),
}).strict()

// LOCATION
//------------------------------------------------------

export const LocationIncludeSchema: z.ZodType<Prisma.LocationInclude> = z.object({
  Merchant: z.union([z.boolean(),z.lazy(() => MerchantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LocationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const LocationArgsSchema: z.ZodType<Prisma.LocationDefaultArgs> = z.object({
  select: z.lazy(() => LocationSelectSchema).optional(),
  include: z.lazy(() => LocationIncludeSchema).optional(),
}).strict();

export const LocationCountOutputTypeArgsSchema: z.ZodType<Prisma.LocationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => LocationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const LocationCountOutputTypeSelectSchema: z.ZodType<Prisma.LocationCountOutputTypeSelect> = z.object({
  Merchant: z.boolean().optional(),
}).strict();

export const LocationSelectSchema: z.ZodType<Prisma.LocationSelect> = z.object({
  uid: z.boolean().optional(),
  ip: z.boolean().optional(),
  latitude: z.boolean().optional(),
  longitude: z.boolean().optional(),
  altitude: z.boolean().optional(),
  accuracy: z.boolean().optional(),
  altitudeAccuracy: z.boolean().optional(),
  heading: z.boolean().optional(),
  speed: z.boolean().optional(),
  continent_code: z.boolean().optional(),
  continent_name: z.boolean().optional(),
  country_code: z.boolean().optional(),
  country_name: z.boolean().optional(),
  subdivision_code: z.boolean().optional(),
  subdivision_name: z.boolean().optional(),
  city_name: z.boolean().optional(),
  postal_code: z.boolean().optional(),
  timezone: z.boolean().optional(),
  address: z.boolean().optional(),
  notes: z.boolean().optional(),
  sha512: z.boolean().optional(),
  Merchant: z.union([z.boolean(),z.lazy(() => MerchantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LocationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MATERIAL
//------------------------------------------------------

export const MaterialIncludeSchema: z.ZodType<Prisma.MaterialInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  DentalTherapy: z.union([z.boolean(),z.lazy(() => DentalTherapyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MaterialCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const MaterialArgsSchema: z.ZodType<Prisma.MaterialDefaultArgs> = z.object({
  select: z.lazy(() => MaterialSelectSchema).optional(),
  include: z.lazy(() => MaterialIncludeSchema).optional(),
}).strict();

export const MaterialCountOutputTypeArgsSchema: z.ZodType<Prisma.MaterialCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MaterialCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MaterialCountOutputTypeSelectSchema: z.ZodType<Prisma.MaterialCountOutputTypeSelect> = z.object({
  DentalTherapy: z.boolean().optional(),
}).strict();

export const MaterialSelectSchema: z.ZodType<Prisma.MaterialSelect> = z.object({
  uid: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  longdescription: z.boolean().optional(),
  type: z.boolean().optional(),
  url: z.boolean().optional(),
  weight: z.boolean().optional(),
  price: z.boolean().optional(),
  currency: z.boolean().optional(),
  sha512: z.boolean().optional(),
  manufacturer: z.boolean().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  useruid: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  DentalTherapy: z.union([z.boolean(),z.lazy(() => DentalTherapyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MaterialCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MERCHANT
//------------------------------------------------------

export const MerchantIncludeSchema: z.ZodType<Prisma.MerchantInclude> = z.object({
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  Transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MerchantCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const MerchantArgsSchema: z.ZodType<Prisma.MerchantDefaultArgs> = z.object({
  select: z.lazy(() => MerchantSelectSchema).optional(),
  include: z.lazy(() => MerchantIncludeSchema).optional(),
}).strict();

export const MerchantCountOutputTypeArgsSchema: z.ZodType<Prisma.MerchantCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MerchantCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MerchantCountOutputTypeSelectSchema: z.ZodType<Prisma.MerchantCountOutputTypeSelect> = z.object({
  Transactions: z.boolean().optional(),
}).strict();

export const MerchantSelectSchema: z.ZodType<Prisma.MerchantSelect> = z.object({
  uid: z.boolean().optional(),
  name: z.boolean().optional(),
  locationRef: z.boolean().optional(),
  contact: z.boolean().optional(),
  website: z.boolean().optional(),
  notes: z.boolean().optional(),
  sha512: z.boolean().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  location: z.union([z.boolean(),z.lazy(() => LocationArgsSchema)]).optional(),
  Transactions: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MerchantCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORGANIZATION MEMBER
//------------------------------------------------------

export const OrganizationMemberIncludeSchema: z.ZodType<Prisma.OrganizationMemberInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const OrganizationMemberArgsSchema: z.ZodType<Prisma.OrganizationMemberDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationMemberSelectSchema).optional(),
  include: z.lazy(() => OrganizationMemberIncludeSchema).optional(),
}).strict();

export const OrganizationMemberSelectSchema: z.ZodType<Prisma.OrganizationMemberSelect> = z.object({
  uid: z.boolean().optional(),
  useruid: z.boolean().optional(),
  orguid: z.boolean().optional(),
  created: z.boolean().optional(),
  role: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// ORGANIZATION
//------------------------------------------------------

export const OrganizationIncludeSchema: z.ZodType<Prisma.OrganizationInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  members: z.union([z.boolean(),z.lazy(() => OrganizationMemberFindManyArgsSchema)]).optional(),
  ProvidedRecords: z.union([z.boolean(),z.lazy(() => UserRecordFindManyArgsSchema)]).optional(),
  Uploads: z.union([z.boolean(),z.lazy(() => UploadFindManyArgsSchema)]).optional(),
  oAuthConnections: z.union([z.boolean(),z.lazy(() => oAuthConnectionFindManyArgsSchema)]).optional(),
  oAuthRefreshTokens: z.union([z.boolean(),z.lazy(() => oAuthRefreshTokenFindManyArgsSchema)]).optional(),
  OverallCollectedAccuracies: z.union([z.boolean(),z.lazy(() => OverallCollectedAccuracyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OrganizationArgsSchema: z.ZodType<Prisma.OrganizationDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationSelectSchema).optional(),
  include: z.lazy(() => OrganizationIncludeSchema).optional(),
}).strict();

export const OrganizationCountOutputTypeArgsSchema: z.ZodType<Prisma.OrganizationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrganizationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrganizationCountOutputTypeSelectSchema: z.ZodType<Prisma.OrganizationCountOutputTypeSelect> = z.object({
  members: z.boolean().optional(),
  ProvidedRecords: z.boolean().optional(),
  Uploads: z.boolean().optional(),
  oAuthConnections: z.boolean().optional(),
  oAuthRefreshTokens: z.boolean().optional(),
  OverallCollectedAccuracies: z.boolean().optional(),
}).strict();

export const OrganizationSelectSchema: z.ZodType<Prisma.OrganizationSelect> = z.object({
  uid: z.boolean().optional(),
  name: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  description: z.boolean().optional(),
  redirecturl: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  members: z.union([z.boolean(),z.lazy(() => OrganizationMemberFindManyArgsSchema)]).optional(),
  ProvidedRecords: z.union([z.boolean(),z.lazy(() => UserRecordFindManyArgsSchema)]).optional(),
  Uploads: z.union([z.boolean(),z.lazy(() => UploadFindManyArgsSchema)]).optional(),
  oAuthConnections: z.union([z.boolean(),z.lazy(() => oAuthConnectionFindManyArgsSchema)]).optional(),
  oAuthRefreshTokens: z.union([z.boolean(),z.lazy(() => oAuthRefreshTokenFindManyArgsSchema)]).optional(),
  OverallCollectedAccuracies: z.union([z.boolean(),z.lazy(() => OverallCollectedAccuracyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrganizationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER RECORD
//------------------------------------------------------

export const UserRecordIncludeSchema: z.ZodType<Prisma.UserRecordInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const UserRecordArgsSchema: z.ZodType<Prisma.UserRecordDefaultArgs> = z.object({
  select: z.lazy(() => UserRecordSelectSchema).optional(),
  include: z.lazy(() => UserRecordIncludeSchema).optional(),
}).strict();

export const UserRecordSelectSchema: z.ZodType<Prisma.UserRecordSelect> = z.object({
  uid: z.boolean().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  outdated: z.boolean().optional(),
  category: z.boolean().optional(),
  tags: z.boolean().optional(),
  data: z.boolean().optional(),
  accuracy: z.boolean().optional(),
  useruid: z.boolean().optional(),
  orguid: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// OVERALL COLLECTED ACCURACY
//------------------------------------------------------

export const OverallCollectedAccuracyIncludeSchema: z.ZodType<Prisma.OverallCollectedAccuracyInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const OverallCollectedAccuracyArgsSchema: z.ZodType<Prisma.OverallCollectedAccuracyDefaultArgs> = z.object({
  select: z.lazy(() => OverallCollectedAccuracySelectSchema).optional(),
  include: z.lazy(() => OverallCollectedAccuracyIncludeSchema).optional(),
}).strict();

export const OverallCollectedAccuracySelectSchema: z.ZodType<Prisma.OverallCollectedAccuracySelect> = z.object({
  uid: z.boolean().optional(),
  useruid: z.boolean().optional(),
  orguid: z.boolean().optional(),
  accuracy: z.boolean().optional(),
  created: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// UPLOAD
//------------------------------------------------------

export const UploadIncludeSchema: z.ZodType<Prisma.UploadInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const UploadArgsSchema: z.ZodType<Prisma.UploadDefaultArgs> = z.object({
  select: z.lazy(() => UploadSelectSchema).optional(),
  include: z.lazy(() => UploadIncludeSchema).optional(),
}).strict();

export const UploadSelectSchema: z.ZodType<Prisma.UploadSelect> = z.object({
  uid: z.boolean().optional(),
  filename: z.boolean().optional(),
  description: z.boolean().optional(),
  mimetype: z.boolean().optional(),
  encoding: z.boolean().optional(),
  useruid: z.boolean().optional(),
  orguid: z.boolean().optional(),
  created: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// O AUTH REFRESH TOKEN
//------------------------------------------------------

export const oAuthRefreshTokenIncludeSchema: z.ZodType<Prisma.oAuthRefreshTokenInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const oAuthRefreshTokenArgsSchema: z.ZodType<Prisma.oAuthRefreshTokenDefaultArgs> = z.object({
  select: z.lazy(() => oAuthRefreshTokenSelectSchema).optional(),
  include: z.lazy(() => oAuthRefreshTokenIncludeSchema).optional(),
}).strict();

export const oAuthRefreshTokenSelectSchema: z.ZodType<Prisma.oAuthRefreshTokenSelect> = z.object({
  uid: z.boolean().optional(),
  token: z.boolean().optional(),
  useruid: z.boolean().optional(),
  orguid: z.boolean().optional(),
  created: z.boolean().optional(),
  validUntil: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// O AUTH CONNECTION
//------------------------------------------------------

export const oAuthConnectionIncludeSchema: z.ZodType<Prisma.oAuthConnectionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

export const oAuthConnectionArgsSchema: z.ZodType<Prisma.oAuthConnectionDefaultArgs> = z.object({
  select: z.lazy(() => oAuthConnectionSelectSchema).optional(),
  include: z.lazy(() => oAuthConnectionIncludeSchema).optional(),
}).strict();

export const oAuthConnectionSelectSchema: z.ZodType<Prisma.oAuthConnectionSelect> = z.object({
  uid: z.boolean().optional(),
  useruid: z.boolean().optional(),
  orguid: z.boolean().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  scopes: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  organization: z.union([z.boolean(),z.lazy(() => OrganizationArgsSchema)]).optional(),
}).strict()

// REFRESH TOKEN
//------------------------------------------------------

export const RefreshTokenIncludeSchema: z.ZodType<Prisma.RefreshTokenInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const RefreshTokenArgsSchema: z.ZodType<Prisma.RefreshTokenDefaultArgs> = z.object({
  select: z.lazy(() => RefreshTokenSelectSchema).optional(),
  include: z.lazy(() => RefreshTokenIncludeSchema).optional(),
}).strict();

export const RefreshTokenSelectSchema: z.ZodType<Prisma.RefreshTokenSelect> = z.object({
  uid: z.boolean().optional(),
  token: z.boolean().optional(),
  useruid: z.boolean().optional(),
  created: z.boolean().optional(),
  validUntil: z.boolean().optional(),
  ip: z.boolean().optional(),
  agent: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// TRANSACTION
//------------------------------------------------------

export const TransactionIncludeSchema: z.ZodType<Prisma.TransactionInclude> = z.object({
  merchant: z.union([z.boolean(),z.lazy(() => MerchantArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  DentalTherapies: z.union([z.boolean(),z.lazy(() => DentalTherapyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TransactionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TransactionArgsSchema: z.ZodType<Prisma.TransactionDefaultArgs> = z.object({
  select: z.lazy(() => TransactionSelectSchema).optional(),
  include: z.lazy(() => TransactionIncludeSchema).optional(),
}).strict();

export const TransactionCountOutputTypeArgsSchema: z.ZodType<Prisma.TransactionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TransactionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TransactionCountOutputTypeSelectSchema: z.ZodType<Prisma.TransactionCountOutputTypeSelect> = z.object({
  DentalTherapies: z.boolean().optional(),
}).strict();

export const TransactionSelectSchema: z.ZodType<Prisma.TransactionSelect> = z.object({
  uid: z.boolean().optional(),
  date: z.boolean().optional(),
  type: z.boolean().optional(),
  description: z.boolean().optional(),
  category: z.boolean().optional(),
  tags: z.boolean().optional(),
  merchantRef: z.boolean().optional(),
  amount: z.boolean().optional(),
  currency: z.boolean().optional(),
  tax: z.boolean().optional(),
  taxIncluded: z.boolean().optional(),
  accuracy: z.boolean().optional(),
  data: z.boolean().optional(),
  notes: z.boolean().optional(),
  sha512: z.boolean().optional(),
  useruid: z.boolean().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  merchant: z.union([z.boolean(),z.lazy(() => MerchantArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  DentalTherapies: z.union([z.boolean(),z.lazy(() => DentalTherapyFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TransactionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  RefreshTokens: z.union([z.boolean(),z.lazy(() => RefreshTokenFindManyArgsSchema)]).optional(),
  oAuthRefreshTokens: z.union([z.boolean(),z.lazy(() => oAuthRefreshTokenFindManyArgsSchema)]).optional(),
  Organizations: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  OrganizationMemberOf: z.union([z.boolean(),z.lazy(() => OrganizationMemberFindManyArgsSchema)]).optional(),
  Records: z.union([z.boolean(),z.lazy(() => UserRecordFindManyArgsSchema)]).optional(),
  Uploads: z.union([z.boolean(),z.lazy(() => UploadFindManyArgsSchema)]).optional(),
  oAuthConnections: z.union([z.boolean(),z.lazy(() => oAuthConnectionFindManyArgsSchema)]).optional(),
  OverallCollectedAccuracies: z.union([z.boolean(),z.lazy(() => OverallCollectedAccuracyFindManyArgsSchema)]).optional(),
  Materials: z.union([z.boolean(),z.lazy(() => MaterialFindManyArgsSchema)]).optional(),
  Transaction: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  RefreshTokens: z.boolean().optional(),
  oAuthRefreshTokens: z.boolean().optional(),
  Organizations: z.boolean().optional(),
  OrganizationMemberOf: z.boolean().optional(),
  Records: z.boolean().optional(),
  Uploads: z.boolean().optional(),
  oAuthConnections: z.boolean().optional(),
  OverallCollectedAccuracies: z.boolean().optional(),
  Materials: z.boolean().optional(),
  Transaction: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  uid: z.boolean().optional(),
  email: z.boolean().optional(),
  firstname: z.boolean().optional(),
  lastname: z.boolean().optional(),
  password: z.boolean().optional(),
  created: z.boolean().optional(),
  updated: z.boolean().optional(),
  RefreshTokens: z.union([z.boolean(),z.lazy(() => RefreshTokenFindManyArgsSchema)]).optional(),
  oAuthRefreshTokens: z.union([z.boolean(),z.lazy(() => oAuthRefreshTokenFindManyArgsSchema)]).optional(),
  Organizations: z.union([z.boolean(),z.lazy(() => OrganizationFindManyArgsSchema)]).optional(),
  OrganizationMemberOf: z.union([z.boolean(),z.lazy(() => OrganizationMemberFindManyArgsSchema)]).optional(),
  Records: z.union([z.boolean(),z.lazy(() => UserRecordFindManyArgsSchema)]).optional(),
  Uploads: z.union([z.boolean(),z.lazy(() => UploadFindManyArgsSchema)]).optional(),
  oAuthConnections: z.union([z.boolean(),z.lazy(() => oAuthConnectionFindManyArgsSchema)]).optional(),
  OverallCollectedAccuracies: z.union([z.boolean(),z.lazy(() => OverallCollectedAccuracyFindManyArgsSchema)]).optional(),
  Materials: z.union([z.boolean(),z.lazy(() => MaterialFindManyArgsSchema)]).optional(),
  Transaction: z.union([z.boolean(),z.lazy(() => TransactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const DentalTherapyWhereInputSchema: z.ZodType<Prisma.DentalTherapyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DentalTherapyWhereInputSchema),z.lazy(() => DentalTherapyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DentalTherapyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DentalTherapyWhereInputSchema),z.lazy(() => DentalTherapyWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  teeth: z.lazy(() => IntNullableListFilterSchema).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  materialsUsed: z.lazy(() => MaterialListRelationFilterSchema).optional(),
  transactions: z.lazy(() => TransactionListRelationFilterSchema).optional()
}).strict();

export const DentalTherapyOrderByWithRelationInputSchema: z.ZodType<Prisma.DentalTherapyOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  teeth: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  materialsUsed: z.lazy(() => MaterialOrderByRelationAggregateInputSchema).optional(),
  transactions: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const DentalTherapyWhereUniqueInputSchema: z.ZodType<Omit<Prisma.DentalTherapyWhereUniqueInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.string()
})
.and(z.object({
  // omitted: uid: z.string().optional(),
  AND: z.union([ z.lazy(() => DentalTherapyWhereInputSchema),z.lazy(() => DentalTherapyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DentalTherapyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DentalTherapyWhereInputSchema),z.lazy(() => DentalTherapyWhereInputSchema).array() ]).optional(),
  teeth: z.lazy(() => IntNullableListFilterSchema).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  // omitted: sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  // omitted: created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  // omitted: updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  materialsUsed: z.lazy(() => MaterialListRelationFilterSchema).optional(),
  transactions: z.lazy(() => TransactionListRelationFilterSchema).optional()
}).strict());

export const DentalTherapyOrderByWithAggregationInputSchema: z.ZodType<Prisma.DentalTherapyOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  teeth: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DentalTherapyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DentalTherapyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DentalTherapyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DentalTherapyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DentalTherapySumOrderByAggregateInputSchema).optional()
}).strict();

export const DentalTherapyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DentalTherapyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DentalTherapyScalarWhereWithAggregatesInputSchema),z.lazy(() => DentalTherapyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DentalTherapyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DentalTherapyScalarWhereWithAggregatesInputSchema),z.lazy(() => DentalTherapyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  teeth: z.lazy(() => IntNullableListFilterSchema).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const LocationWhereInputSchema: z.ZodType<Prisma.LocationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ip: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  latitude: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  longitude: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  altitude: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  accuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  heading: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  speed: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  continent_code: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  continent_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country_code: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  subdivision_code: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  subdivision_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  postal_code: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  timezone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Merchant: z.lazy(() => MerchantListRelationFilterSchema).optional()
}).strict();

export const LocationOrderByWithRelationInputSchema: z.ZodType<Prisma.LocationOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  ip: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  latitude: z.lazy(() => SortOrderSchema).optional(),
  longitude: z.lazy(() => SortOrderSchema).optional(),
  altitude: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accuracy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  altitudeAccuracy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  heading: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  speed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  continent_code: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  continent_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country_code: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subdivision_code: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subdivision_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  postal_code: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  timezone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  Merchant: z.lazy(() => MerchantOrderByRelationAggregateInputSchema).optional()
}).strict();

export const LocationWhereUniqueInputSchema: z.ZodType<Prisma.LocationWhereUniqueInput> = z.union([
  z.object({
    uid: z.string(),
    ip: z.string()
  }),
  z.object({
    uid: z.string(),
  }),
  z.object({
    ip: z.string(),
  }),
])
.and(z.object({
  uid: z.string().optional(),
  ip: z.string().optional(),
  AND: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationWhereInputSchema),z.lazy(() => LocationWhereInputSchema).array() ]).optional(),
  latitude: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  longitude: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  altitude: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  accuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  heading: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  speed: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  continent_code: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  continent_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country_code: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  subdivision_code: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  subdivision_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  postal_code: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  timezone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Merchant: z.lazy(() => MerchantListRelationFilterSchema).optional()
}).strict());

export const LocationOrderByWithAggregationInputSchema: z.ZodType<Prisma.LocationOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  ip: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  latitude: z.lazy(() => SortOrderSchema).optional(),
  longitude: z.lazy(() => SortOrderSchema).optional(),
  altitude: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accuracy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  altitudeAccuracy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  heading: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  speed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  continent_code: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  continent_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country_code: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subdivision_code: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subdivision_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  postal_code: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  timezone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LocationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LocationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LocationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LocationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LocationSumOrderByAggregateInputSchema).optional()
}).strict();

export const LocationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LocationScalarWhereWithAggregatesInputSchema),z.lazy(() => LocationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ip: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  latitude: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  longitude: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  altitude: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  accuracy: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  heading: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  speed: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  continent_code: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  continent_name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  country_code: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  country_name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  subdivision_code: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  subdivision_name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  city_name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  postal_code: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  timezone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const MaterialWhereInputSchema: z.ZodType<Prisma.MaterialWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MaterialWhereInputSchema),z.lazy(() => MaterialWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MaterialWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MaterialWhereInputSchema),z.lazy(() => MaterialWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  longdescription: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  weight: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  manufacturer: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  useruid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  DentalTherapy: z.lazy(() => DentalTherapyListRelationFilterSchema).optional()
}).strict();

export const MaterialOrderByWithRelationInputSchema: z.ZodType<Prisma.MaterialOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  longdescription: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  url: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  weight: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  DentalTherapy: z.lazy(() => DentalTherapyOrderByRelationAggregateInputSchema).optional()
}).strict();

export const MaterialWhereUniqueInputSchema: z.ZodType<Prisma.MaterialWhereUniqueInput> = z.object({
  uid: z.string()
})
.and(z.object({
  uid: z.string().optional(),
  AND: z.union([ z.lazy(() => MaterialWhereInputSchema),z.lazy(() => MaterialWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MaterialWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MaterialWhereInputSchema),z.lazy(() => MaterialWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  longdescription: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  weight: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  manufacturer: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  useruid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  DentalTherapy: z.lazy(() => DentalTherapyListRelationFilterSchema).optional()
}).strict());

export const MaterialOrderByWithAggregationInputSchema: z.ZodType<Prisma.MaterialOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  longdescription: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  url: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  weight: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => MaterialCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MaterialAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MaterialMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MaterialMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MaterialSumOrderByAggregateInputSchema).optional()
}).strict();

export const MaterialScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MaterialScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MaterialScalarWhereWithAggregatesInputSchema),z.lazy(() => MaterialScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MaterialScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MaterialScalarWhereWithAggregatesInputSchema),z.lazy(() => MaterialScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  longdescription: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  weight: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  manufacturer: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  useruid: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const MerchantWhereInputSchema: z.ZodType<Prisma.MerchantWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MerchantWhereInputSchema),z.lazy(() => MerchantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MerchantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MerchantWhereInputSchema),z.lazy(() => MerchantWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  locationRef: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contact: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional().nullable(),
  Transactions: z.lazy(() => TransactionListRelationFilterSchema).optional()
}).strict();

export const MerchantOrderByWithRelationInputSchema: z.ZodType<Prisma.MerchantOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  locationRef: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  contact: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  website: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => LocationOrderByWithRelationInputSchema).optional(),
  Transactions: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const MerchantWhereUniqueInputSchema: z.ZodType<Prisma.MerchantWhereUniqueInput> = z.object({
  uid: z.string()
})
.and(z.object({
  uid: z.string().optional(),
  AND: z.union([ z.lazy(() => MerchantWhereInputSchema),z.lazy(() => MerchantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MerchantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MerchantWhereInputSchema),z.lazy(() => MerchantWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  locationRef: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contact: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  location: z.union([ z.lazy(() => LocationNullableRelationFilterSchema),z.lazy(() => LocationWhereInputSchema) ]).optional().nullable(),
  Transactions: z.lazy(() => TransactionListRelationFilterSchema).optional()
}).strict());

export const MerchantOrderByWithAggregationInputSchema: z.ZodType<Prisma.MerchantOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  locationRef: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  contact: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  website: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MerchantCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MerchantMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MerchantMinOrderByAggregateInputSchema).optional()
}).strict();

export const MerchantScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MerchantScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MerchantScalarWhereWithAggregatesInputSchema),z.lazy(() => MerchantScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MerchantScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MerchantScalarWhereWithAggregatesInputSchema),z.lazy(() => MerchantScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  locationRef: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  contact: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OrganizationMemberWhereInputSchema: z.ZodType<Prisma.OrganizationMemberWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMemberWhereInputSchema),z.lazy(() => OrganizationMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMemberWhereInputSchema),z.lazy(() => OrganizationMemberWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => EnumOrganizationRoleFilterSchema),z.lazy(() => OrganizationRoleSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationMemberOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const OrganizationMemberWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationMemberWhereUniqueInput> = z.object({
  uid: z.string()
})
.and(z.object({
  uid: z.string().optional(),
  AND: z.union([ z.lazy(() => OrganizationMemberWhereInputSchema),z.lazy(() => OrganizationMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMemberWhereInputSchema),z.lazy(() => OrganizationMemberWhereInputSchema).array() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => EnumOrganizationRoleFilterSchema),z.lazy(() => OrganizationRoleSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const OrganizationMemberOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationMemberOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationMemberCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationMemberMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationMemberMinOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationMemberScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationMemberScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationMemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => EnumOrganizationRoleWithAggregatesFilterSchema),z.lazy(() => OrganizationRoleSchema) ]).optional(),
}).strict();

export const OrganizationWhereInputSchema: z.ZodType<Prisma.OrganizationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  redirecturl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberListRelationFilterSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordListRelationFilterSchema).optional(),
  Uploads: z.lazy(() => UploadListRelationFilterSchema).optional(),
  oAuthConnections: z.lazy(() => OAuthConnectionListRelationFilterSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => OAuthRefreshTokenListRelationFilterSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyListRelationFilterSchema).optional()
}).strict();

export const OrganizationOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  redirecturl: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberOrderByRelationAggregateInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordOrderByRelationAggregateInputSchema).optional(),
  Uploads: z.lazy(() => UploadOrderByRelationAggregateInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionOrderByRelationAggregateInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenOrderByRelationAggregateInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyOrderByRelationAggregateInputSchema).optional()
}).strict();

export const OrganizationWhereUniqueInputSchema: z.ZodType<Prisma.OrganizationWhereUniqueInput> = z.union([
  z.object({
    uid: z.string(),
    name: z.string()
  }),
  z.object({
    uid: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  uid: z.string().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationWhereInputSchema),z.lazy(() => OrganizationWhereInputSchema).array() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  redirecturl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberListRelationFilterSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordListRelationFilterSchema).optional(),
  Uploads: z.lazy(() => UploadListRelationFilterSchema).optional(),
  oAuthConnections: z.lazy(() => OAuthConnectionListRelationFilterSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => OAuthRefreshTokenListRelationFilterSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyListRelationFilterSchema).optional()
}).strict());

export const OrganizationOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizationOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  redirecturl: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizationMinOrderByAggregateInputSchema).optional()
}).strict();

export const OrganizationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema),z.lazy(() => OrganizationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  redirecturl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserRecordWhereInputSchema: z.ZodType<Prisma.UserRecordWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserRecordWhereInputSchema),z.lazy(() => UserRecordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRecordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRecordWhereInputSchema),z.lazy(() => UserRecordWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  outdated: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  category: z.union([ z.lazy(() => EnumRecordCategoryFilterSchema),z.lazy(() => RecordCategorySchema) ]).optional(),
  tags: z.lazy(() => EnumRecordTagNullableListFilterSchema).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  accuracy: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const UserRecordOrderByWithRelationInputSchema: z.ZodType<Prisma.UserRecordOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  outdated: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const UserRecordWhereUniqueInputSchema: z.ZodType<Prisma.UserRecordWhereUniqueInput> = z.object({
  uid: z.string()
})
.and(z.object({
  uid: z.string().optional(),
  AND: z.union([ z.lazy(() => UserRecordWhereInputSchema),z.lazy(() => UserRecordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRecordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRecordWhereInputSchema),z.lazy(() => UserRecordWhereInputSchema).array() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  outdated: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  category: z.union([ z.lazy(() => EnumRecordCategoryFilterSchema),z.lazy(() => RecordCategorySchema) ]).optional(),
  tags: z.lazy(() => EnumRecordTagNullableListFilterSchema).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  accuracy: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const UserRecordOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserRecordOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  outdated: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserRecordCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserRecordAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserRecordMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserRecordMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserRecordSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserRecordScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserRecordScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserRecordScalarWhereWithAggregatesInputSchema),z.lazy(() => UserRecordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRecordScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRecordScalarWhereWithAggregatesInputSchema),z.lazy(() => UserRecordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  outdated: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  category: z.union([ z.lazy(() => EnumRecordCategoryWithAggregatesFilterSchema),z.lazy(() => RecordCategorySchema) ]).optional(),
  tags: z.lazy(() => EnumRecordTagNullableListFilterSchema).optional(),
  data: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  accuracy: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  useruid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const OverallCollectedAccuracyWhereInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OverallCollectedAccuracyWhereInputSchema),z.lazy(() => OverallCollectedAccuracyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OverallCollectedAccuracyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OverallCollectedAccuracyWhereInputSchema),z.lazy(() => OverallCollectedAccuracyWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accuracy: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const OverallCollectedAccuracyOrderByWithRelationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const OverallCollectedAccuracyWhereUniqueInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyWhereUniqueInput> = z.object({
  uid: z.string()
})
.and(z.object({
  uid: z.string().optional(),
  AND: z.union([ z.lazy(() => OverallCollectedAccuracyWhereInputSchema),z.lazy(() => OverallCollectedAccuracyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OverallCollectedAccuracyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OverallCollectedAccuracyWhereInputSchema),z.lazy(() => OverallCollectedAccuracyWhereInputSchema).array() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accuracy: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const OverallCollectedAccuracyOrderByWithAggregationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OverallCollectedAccuracyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OverallCollectedAccuracyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OverallCollectedAccuracyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OverallCollectedAccuracyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OverallCollectedAccuracySumOrderByAggregateInputSchema).optional()
}).strict();

export const OverallCollectedAccuracyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OverallCollectedAccuracyScalarWhereWithAggregatesInputSchema),z.lazy(() => OverallCollectedAccuracyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OverallCollectedAccuracyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OverallCollectedAccuracyScalarWhereWithAggregatesInputSchema),z.lazy(() => OverallCollectedAccuracyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  accuracy: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UploadWhereInputSchema: z.ZodType<Prisma.UploadWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UploadWhereInputSchema),z.lazy(() => UploadWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UploadWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UploadWhereInputSchema),z.lazy(() => UploadWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  filename: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mimetype: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  encoding: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const UploadOrderByWithRelationInputSchema: z.ZodType<Prisma.UploadOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  filename: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  mimetype: z.lazy(() => SortOrderSchema).optional(),
  encoding: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const UploadWhereUniqueInputSchema: z.ZodType<Prisma.UploadWhereUniqueInput> = z.object({
  uid: z.string()
})
.and(z.object({
  uid: z.string().optional(),
  AND: z.union([ z.lazy(() => UploadWhereInputSchema),z.lazy(() => UploadWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UploadWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UploadWhereInputSchema),z.lazy(() => UploadWhereInputSchema).array() ]).optional(),
  filename: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mimetype: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  encoding: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const UploadOrderByWithAggregationInputSchema: z.ZodType<Prisma.UploadOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  filename: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  mimetype: z.lazy(() => SortOrderSchema).optional(),
  encoding: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UploadCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UploadMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UploadMinOrderByAggregateInputSchema).optional()
}).strict();

export const UploadScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UploadScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UploadScalarWhereWithAggregatesInputSchema),z.lazy(() => UploadScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UploadScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UploadScalarWhereWithAggregatesInputSchema),z.lazy(() => UploadScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  filename: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  mimetype: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  encoding: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const oAuthRefreshTokenWhereInputSchema: z.ZodType<Prisma.oAuthRefreshTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => oAuthRefreshTokenWhereInputSchema),z.lazy(() => oAuthRefreshTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => oAuthRefreshTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => oAuthRefreshTokenWhereInputSchema),z.lazy(() => oAuthRefreshTokenWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const oAuthRefreshTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const oAuthRefreshTokenWhereUniqueInputSchema: z.ZodType<Prisma.oAuthRefreshTokenWhereUniqueInput> = z.union([
  z.object({
    uid: z.string(),
    token: z.string()
  }),
  z.object({
    uid: z.string(),
  }),
  z.object({
    token: z.string(),
  }),
])
.and(z.object({
  uid: z.string().optional(),
  token: z.string().optional(),
  AND: z.union([ z.lazy(() => oAuthRefreshTokenWhereInputSchema),z.lazy(() => oAuthRefreshTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => oAuthRefreshTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => oAuthRefreshTokenWhereInputSchema),z.lazy(() => oAuthRefreshTokenWhereInputSchema).array() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const oAuthRefreshTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => oAuthRefreshTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => oAuthRefreshTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => oAuthRefreshTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const oAuthRefreshTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.oAuthRefreshTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => oAuthRefreshTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => oAuthRefreshTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => oAuthRefreshTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => oAuthRefreshTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => oAuthRefreshTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const oAuthConnectionWhereInputSchema: z.ZodType<Prisma.oAuthConnectionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => oAuthConnectionWhereInputSchema),z.lazy(() => oAuthConnectionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => oAuthConnectionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => oAuthConnectionWhereInputSchema),z.lazy(() => oAuthConnectionWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  scopes: z.lazy(() => StringNullableListFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict();

export const oAuthConnectionOrderByWithRelationInputSchema: z.ZodType<Prisma.oAuthConnectionOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  scopes: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  organization: z.lazy(() => OrganizationOrderByWithRelationInputSchema).optional()
}).strict();

export const oAuthConnectionWhereUniqueInputSchema: z.ZodType<Prisma.oAuthConnectionWhereUniqueInput> = z.union([
  z.object({
    uid: z.string(),
    useruid_orguid: z.lazy(() => oAuthConnectionUseruidOrguidCompoundUniqueInputSchema)
  }),
  z.object({
    uid: z.string(),
  }),
  z.object({
    useruid_orguid: z.lazy(() => oAuthConnectionUseruidOrguidCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  uid: z.string().optional(),
  useruid_orguid: z.lazy(() => oAuthConnectionUseruidOrguidCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => oAuthConnectionWhereInputSchema),z.lazy(() => oAuthConnectionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => oAuthConnectionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => oAuthConnectionWhereInputSchema),z.lazy(() => oAuthConnectionWhereInputSchema).array() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  scopes: z.lazy(() => StringNullableListFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  organization: z.union([ z.lazy(() => OrganizationRelationFilterSchema),z.lazy(() => OrganizationWhereInputSchema) ]).optional(),
}).strict());

export const oAuthConnectionOrderByWithAggregationInputSchema: z.ZodType<Prisma.oAuthConnectionOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  scopes: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => oAuthConnectionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => oAuthConnectionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => oAuthConnectionMinOrderByAggregateInputSchema).optional()
}).strict();

export const oAuthConnectionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.oAuthConnectionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => oAuthConnectionScalarWhereWithAggregatesInputSchema),z.lazy(() => oAuthConnectionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => oAuthConnectionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => oAuthConnectionScalarWhereWithAggregatesInputSchema),z.lazy(() => oAuthConnectionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  scopes: z.lazy(() => StringNullableListFilterSchema).optional()
}).strict();

export const RefreshTokenWhereInputSchema: z.ZodType<Prisma.RefreshTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RefreshTokenWhereInputSchema),z.lazy(() => RefreshTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RefreshTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RefreshTokenWhereInputSchema),z.lazy(() => RefreshTokenWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ip: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  agent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const RefreshTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.RefreshTokenOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  ip: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  agent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const RefreshTokenWhereUniqueInputSchema: z.ZodType<Prisma.RefreshTokenWhereUniqueInput> = z.union([
  z.object({
    uid: z.string(),
    token: z.string()
  }),
  z.object({
    uid: z.string(),
  }),
  z.object({
    token: z.string(),
  }),
])
.and(z.object({
  uid: z.string().optional(),
  token: z.string().optional(),
  AND: z.union([ z.lazy(() => RefreshTokenWhereInputSchema),z.lazy(() => RefreshTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RefreshTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RefreshTokenWhereInputSchema),z.lazy(() => RefreshTokenWhereInputSchema).array() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ip: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  agent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const RefreshTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.RefreshTokenOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  ip: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  agent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => RefreshTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RefreshTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RefreshTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const RefreshTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RefreshTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => RefreshTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ip: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  agent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const TransactionWhereInputSchema: z.ZodType<Prisma.TransactionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TransactionWhereInputSchema),z.lazy(() => TransactionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransactionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransactionWhereInputSchema),z.lazy(() => TransactionWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumTransactionTypeFilterSchema),z.lazy(() => TransactionTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  merchantRef: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tax: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  taxIncluded: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  accuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  data: z.lazy(() => JsonNullableFilterSchema).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  useruid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  merchant: z.union([ z.lazy(() => MerchantNullableRelationFilterSchema),z.lazy(() => MerchantWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  DentalTherapies: z.lazy(() => DentalTherapyListRelationFilterSchema).optional()
}).strict();

export const TransactionOrderByWithRelationInputSchema: z.ZodType<Prisma.TransactionOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  merchantRef: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  tax: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  taxIncluded: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accuracy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  useruid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  merchant: z.lazy(() => MerchantOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TransactionWhereUniqueInputSchema: z.ZodType<Prisma.TransactionWhereUniqueInput> = z.object({
  uid: z.string()
})
.and(z.object({
  uid: z.string().optional(),
  AND: z.union([ z.lazy(() => TransactionWhereInputSchema),z.lazy(() => TransactionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransactionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransactionWhereInputSchema),z.lazy(() => TransactionWhereInputSchema).array() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumTransactionTypeFilterSchema),z.lazy(() => TransactionTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  merchantRef: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tax: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  taxIncluded: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  accuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  data: z.lazy(() => JsonNullableFilterSchema).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  useruid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  merchant: z.union([ z.lazy(() => MerchantNullableRelationFilterSchema),z.lazy(() => MerchantWhereInputSchema) ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  DentalTherapies: z.lazy(() => DentalTherapyListRelationFilterSchema).optional()
}).strict());

export const TransactionOrderByWithAggregationInputSchema: z.ZodType<Prisma.TransactionOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  merchantRef: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  tax: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  taxIncluded: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accuracy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sha512: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  useruid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TransactionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TransactionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TransactionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TransactionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TransactionSumOrderByAggregateInputSchema).optional()
}).strict();

export const TransactionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TransactionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema),z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema),z.lazy(() => TransactionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumTransactionTypeWithAggregatesFilterSchema),z.lazy(() => TransactionTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  merchantRef: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  amount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  currency: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tax: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  taxIncluded: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  accuracy: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  data: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  useruid: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstname: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastname: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenListRelationFilterSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => OAuthRefreshTokenListRelationFilterSchema).optional(),
  Organizations: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberListRelationFilterSchema).optional(),
  Records: z.lazy(() => UserRecordListRelationFilterSchema).optional(),
  Uploads: z.lazy(() => UploadListRelationFilterSchema).optional(),
  oAuthConnections: z.lazy(() => OAuthConnectionListRelationFilterSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyListRelationFilterSchema).optional(),
  Materials: z.lazy(() => MaterialListRelationFilterSchema).optional(),
  Transaction: z.lazy(() => TransactionListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenOrderByRelationAggregateInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenOrderByRelationAggregateInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationOrderByRelationAggregateInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberOrderByRelationAggregateInputSchema).optional(),
  Records: z.lazy(() => UserRecordOrderByRelationAggregateInputSchema).optional(),
  Uploads: z.lazy(() => UploadOrderByRelationAggregateInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionOrderByRelationAggregateInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyOrderByRelationAggregateInputSchema).optional(),
  Materials: z.lazy(() => MaterialOrderByRelationAggregateInputSchema).optional(),
  Transaction: z.lazy(() => TransactionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    uid: z.string(),
    email: z.string()
  }),
  z.object({
    uid: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  uid: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  firstname: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastname: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenListRelationFilterSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => OAuthRefreshTokenListRelationFilterSchema).optional(),
  Organizations: z.lazy(() => OrganizationListRelationFilterSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberListRelationFilterSchema).optional(),
  Records: z.lazy(() => UserRecordListRelationFilterSchema).optional(),
  Uploads: z.lazy(() => UploadListRelationFilterSchema).optional(),
  oAuthConnections: z.lazy(() => OAuthConnectionListRelationFilterSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyListRelationFilterSchema).optional(),
  Materials: z.lazy(() => MaterialListRelationFilterSchema).optional(),
  Transaction: z.lazy(() => TransactionListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstname: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastname: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DentalTherapyCreateInputSchema: z.ZodType<Omit<Prisma.DentalTherapyCreateInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.string().optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyCreateteethInputSchema),z.number().array() ]).optional(),
  type: z.string(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // omitted: sha512: z.string(),
  // omitted: created: z.coerce.date().optional(),
  // omitted: updated: z.coerce.date().optional(),
  materialsUsed: z.lazy(() => MaterialCreateNestedManyWithoutDentalTherapyInputSchema).optional(),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutDentalTherapiesInputSchema).optional()
}).strict();

export const DentalTherapyUncheckedCreateInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedCreateInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.string().optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyCreateteethInputSchema),z.number().array() ]).optional(),
  type: z.string(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // omitted: sha512: z.string(),
  // omitted: created: z.coerce.date().optional(),
  // omitted: updated: z.coerce.date().optional(),
  materialsUsed: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutDentalTherapyInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutDentalTherapiesInputSchema).optional()
}).strict();

export const DentalTherapyUpdateInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUpdateInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  materialsUsed: z.lazy(() => MaterialUpdateManyWithoutDentalTherapyNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutDentalTherapiesNestedInputSchema).optional()
}).strict();

export const DentalTherapyUncheckedUpdateInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedUpdateInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  materialsUsed: z.lazy(() => MaterialUncheckedUpdateManyWithoutDentalTherapyNestedInputSchema).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutDentalTherapiesNestedInputSchema).optional()
}).strict();

export const DentalTherapyCreateManyInputSchema: z.ZodType<Omit<Prisma.DentalTherapyCreateManyInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.string().optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyCreateteethInputSchema),z.number().array() ]).optional(),
  type: z.string(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // omitted: sha512: z.string(),
  // omitted: created: z.coerce.date().optional(),
  // omitted: updated: z.coerce.date().optional()
}).strict();

export const DentalTherapyUpdateManyMutationInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUpdateManyMutationInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DentalTherapyUncheckedUpdateManyInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedUpdateManyInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationCreateInputSchema: z.ZodType<Prisma.LocationCreateInput> = z.object({
  uid: z.string().optional(),
  ip: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  altitudeAccuracy: z.number().optional().nullable(),
  heading: z.number().optional().nullable(),
  speed: z.number().optional().nullable(),
  continent_code: z.string().optional().nullable(),
  continent_name: z.string().optional().nullable(),
  country_code: z.string().optional().nullable(),
  country_name: z.string().optional().nullable(),
  subdivision_code: z.string().optional().nullable(),
  subdivision_name: z.string().optional().nullable(),
  city_name: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  Merchant: z.lazy(() => MerchantCreateNestedManyWithoutLocationInputSchema).optional()
}).strict();

export const LocationUncheckedCreateInputSchema: z.ZodType<Prisma.LocationUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  ip: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  altitudeAccuracy: z.number().optional().nullable(),
  heading: z.number().optional().nullable(),
  speed: z.number().optional().nullable(),
  continent_code: z.string().optional().nullable(),
  continent_name: z.string().optional().nullable(),
  country_code: z.string().optional().nullable(),
  country_name: z.string().optional().nullable(),
  subdivision_code: z.string().optional().nullable(),
  subdivision_name: z.string().optional().nullable(),
  city_name: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  Merchant: z.lazy(() => MerchantUncheckedCreateNestedManyWithoutLocationInputSchema).optional()
}).strict();

export const LocationUpdateInputSchema: z.ZodType<Prisma.LocationUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  longitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  altitude: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  heading: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  postal_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Merchant: z.lazy(() => MerchantUpdateManyWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationUncheckedUpdateInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  longitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  altitude: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  heading: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  postal_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Merchant: z.lazy(() => MerchantUncheckedUpdateManyWithoutLocationNestedInputSchema).optional()
}).strict();

export const LocationCreateManyInputSchema: z.ZodType<Prisma.LocationCreateManyInput> = z.object({
  uid: z.string().optional(),
  ip: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  altitudeAccuracy: z.number().optional().nullable(),
  heading: z.number().optional().nullable(),
  speed: z.number().optional().nullable(),
  continent_code: z.string().optional().nullable(),
  continent_name: z.string().optional().nullable(),
  country_code: z.string().optional().nullable(),
  country_name: z.string().optional().nullable(),
  subdivision_code: z.string().optional().nullable(),
  subdivision_name: z.string().optional().nullable(),
  city_name: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string()
}).strict();

export const LocationUpdateManyMutationInputSchema: z.ZodType<Prisma.LocationUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  longitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  altitude: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  heading: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  postal_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  longitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  altitude: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  heading: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  postal_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MaterialCreateInputSchema: z.ZodType<Prisma.MaterialCreateInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  longdescription: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  sha512: z.string(),
  manufacturer: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutMaterialsInputSchema).optional(),
  DentalTherapy: z.lazy(() => DentalTherapyCreateNestedManyWithoutMaterialsUsedInputSchema).optional()
}).strict();

export const MaterialUncheckedCreateInputSchema: z.ZodType<Prisma.MaterialUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  longdescription: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  sha512: z.string(),
  manufacturer: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  useruid: z.string().optional().nullable(),
  DentalTherapy: z.lazy(() => DentalTherapyUncheckedCreateNestedManyWithoutMaterialsUsedInputSchema).optional()
}).strict();

export const MaterialUpdateInputSchema: z.ZodType<Prisma.MaterialUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutMaterialsNestedInputSchema).optional(),
  DentalTherapy: z.lazy(() => DentalTherapyUpdateManyWithoutMaterialsUsedNestedInputSchema).optional()
}).strict();

export const MaterialUncheckedUpdateInputSchema: z.ZodType<Prisma.MaterialUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  DentalTherapy: z.lazy(() => DentalTherapyUncheckedUpdateManyWithoutMaterialsUsedNestedInputSchema).optional()
}).strict();

export const MaterialCreateManyInputSchema: z.ZodType<Prisma.MaterialCreateManyInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  longdescription: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  sha512: z.string(),
  manufacturer: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  useruid: z.string().optional().nullable()
}).strict();

export const MaterialUpdateManyMutationInputSchema: z.ZodType<Prisma.MaterialUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MaterialUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MaterialUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MerchantCreateInputSchema: z.ZodType<Prisma.MerchantCreateInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  contact: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutMerchantInputSchema).optional(),
  Transactions: z.lazy(() => TransactionCreateNestedManyWithoutMerchantInputSchema).optional()
}).strict();

export const MerchantUncheckedCreateInputSchema: z.ZodType<Prisma.MerchantUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  locationRef: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  Transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutMerchantInputSchema).optional()
}).strict();

export const MerchantUpdateInputSchema: z.ZodType<Prisma.MerchantUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.lazy(() => LocationUpdateOneWithoutMerchantNestedInputSchema).optional(),
  Transactions: z.lazy(() => TransactionUpdateManyWithoutMerchantNestedInputSchema).optional()
}).strict();

export const MerchantUncheckedUpdateInputSchema: z.ZodType<Prisma.MerchantUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutMerchantNestedInputSchema).optional()
}).strict();

export const MerchantCreateManyInputSchema: z.ZodType<Prisma.MerchantCreateManyInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  locationRef: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const MerchantUpdateManyMutationInputSchema: z.ZodType<Prisma.MerchantUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MerchantUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MerchantUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberCreateInputSchema: z.ZodType<Prisma.OrganizationMemberCreateInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMemberOfInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMemberUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema)
}).strict();

export const OrganizationMemberUpdateInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMemberOfNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMemberUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberCreateManyInputSchema: z.ZodType<Prisma.OrganizationMemberCreateManyInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema)
}).strict();

export const OrganizationMemberUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationCreateInputSchema: z.ZodType<Prisma.OrganizationCreateInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUpdateInputSchema: z.ZodType<Prisma.OrganizationUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationCreateManyInputSchema: z.ZodType<Prisma.OrganizationCreateManyInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string()
}).strict();

export const OrganizationUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizationUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRecordCreateInputSchema: z.ZodType<Prisma.UserRecordCreateInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  user: z.lazy(() => UserCreateNestedOneWithoutRecordsInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutProvidedRecordsInputSchema)
}).strict();

export const UserRecordUncheckedCreateInputSchema: z.ZodType<Prisma.UserRecordUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  useruid: z.string(),
  orguid: z.string()
}).strict();

export const UserRecordUpdateInputSchema: z.ZodType<Prisma.UserRecordUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRecordsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutProvidedRecordsNestedInputSchema).optional()
}).strict();

export const UserRecordUncheckedUpdateInputSchema: z.ZodType<Prisma.UserRecordUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRecordCreateManyInputSchema: z.ZodType<Prisma.UserRecordCreateManyInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  useruid: z.string(),
  orguid: z.string()
}).strict();

export const UserRecordUpdateManyMutationInputSchema: z.ZodType<Prisma.UserRecordUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRecordUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserRecordUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OverallCollectedAccuracyCreateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateInput> = z.object({
  uid: z.string().optional(),
  accuracy: z.number(),
  created: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOverallCollectedAccuraciesInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutOverallCollectedAccuraciesInputSchema)
}).strict();

export const OverallCollectedAccuracyUncheckedCreateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  orguid: z.string(),
  accuracy: z.number(),
  created: z.coerce.date().optional()
}).strict();

export const OverallCollectedAccuracyUpdateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOverallCollectedAccuraciesNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutOverallCollectedAccuraciesNestedInputSchema).optional()
}).strict();

export const OverallCollectedAccuracyUncheckedUpdateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OverallCollectedAccuracyCreateManyInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateManyInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  orguid: z.string(),
  accuracy: z.number(),
  created: z.coerce.date().optional()
}).strict();

export const OverallCollectedAccuracyUpdateManyMutationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OverallCollectedAccuracyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UploadCreateInputSchema: z.ZodType<Prisma.UploadCreateInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  created: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutUploadsInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutUploadsInputSchema)
}).strict();

export const UploadUncheckedCreateInputSchema: z.ZodType<Prisma.UploadUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional()
}).strict();

export const UploadUpdateInputSchema: z.ZodType<Prisma.UploadUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUploadsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutUploadsNestedInputSchema).optional()
}).strict();

export const UploadUncheckedUpdateInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UploadCreateManyInputSchema: z.ZodType<Prisma.UploadCreateManyInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional()
}).strict();

export const UploadUpdateManyMutationInputSchema: z.ZodType<Prisma.UploadUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UploadUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const oAuthRefreshTokenCreateInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutOAuthRefreshTokensInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutOAuthRefreshTokensInputSchema)
}).strict();

export const oAuthRefreshTokenUncheckedCreateInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date()
}).strict();

export const oAuthRefreshTokenUpdateInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOAuthRefreshTokensNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutOAuthRefreshTokensNestedInputSchema).optional()
}).strict();

export const oAuthRefreshTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const oAuthRefreshTokenCreateManyInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateManyInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date()
}).strict();

export const oAuthRefreshTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const oAuthRefreshTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const oAuthConnectionCreateInputSchema: z.ZodType<Prisma.oAuthConnectionCreateInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOAuthConnectionsInputSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutOAuthConnectionsInputSchema)
}).strict();

export const oAuthConnectionUncheckedCreateInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthConnectionUpdateInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOAuthConnectionsNestedInputSchema).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutOAuthConnectionsNestedInputSchema).optional()
}).strict();

export const oAuthConnectionUncheckedUpdateInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthConnectionCreateManyInputSchema: z.ZodType<Prisma.oAuthConnectionCreateManyInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthConnectionUpdateManyMutationInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthConnectionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const RefreshTokenCreateInputSchema: z.ZodType<Prisma.RefreshTokenCreateInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  ip: z.string().optional().nullable(),
  agent: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutRefreshTokensInputSchema)
}).strict();

export const RefreshTokenUncheckedCreateInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  useruid: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  ip: z.string().optional().nullable(),
  agent: z.string().optional().nullable()
}).strict();

export const RefreshTokenUpdateInputSchema: z.ZodType<Prisma.RefreshTokenUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRefreshTokensNestedInputSchema).optional()
}).strict();

export const RefreshTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RefreshTokenCreateManyInputSchema: z.ZodType<Prisma.RefreshTokenCreateManyInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  useruid: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  ip: z.string().optional().nullable(),
  agent: z.string().optional().nullable()
}).strict();

export const RefreshTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.RefreshTokenUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RefreshTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TransactionCreateInputSchema: z.ZodType<Prisma.TransactionCreateInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  merchant: z.lazy(() => MerchantCreateNestedOneWithoutTransactionsInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutTransactionInputSchema).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyCreateNestedManyWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.string().optional().nullable(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  useruid: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUncheckedCreateNestedManyWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUpdateInputSchema: z.ZodType<Prisma.TransactionUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  merchant: z.lazy(() => MerchantUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutTransactionNestedInputSchema).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUpdateManyWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUncheckedUpdateManyWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionCreateManyInputSchema: z.ZodType<Prisma.TransactionCreateManyInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.string().optional().nullable(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  useruid: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const TransactionUpdateManyMutationInputSchema: z.ZodType<Prisma.TransactionUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const IntNullableListFilterSchema: z.ZodType<Prisma.IntNullableListFilter> = z.object({
  equals: z.number().array().optional().nullable(),
  has: z.number().optional().nullable(),
  hasEvery: z.number().array().optional(),
  hasSome: z.number().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const MaterialListRelationFilterSchema: z.ZodType<Prisma.MaterialListRelationFilter> = z.object({
  every: z.lazy(() => MaterialWhereInputSchema).optional(),
  some: z.lazy(() => MaterialWhereInputSchema).optional(),
  none: z.lazy(() => MaterialWhereInputSchema).optional()
}).strict();

export const TransactionListRelationFilterSchema: z.ZodType<Prisma.TransactionListRelationFilter> = z.object({
  every: z.lazy(() => TransactionWhereInputSchema).optional(),
  some: z.lazy(() => TransactionWhereInputSchema).optional(),
  none: z.lazy(() => TransactionWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const MaterialOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MaterialOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TransactionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DentalTherapyCountOrderByAggregateInputSchema: z.ZodType<Prisma.DentalTherapyCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  teeth: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DentalTherapyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DentalTherapyAvgOrderByAggregateInput> = z.object({
  teeth: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DentalTherapyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DentalTherapyMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DentalTherapyMinOrderByAggregateInputSchema: z.ZodType<Prisma.DentalTherapyMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DentalTherapySumOrderByAggregateInputSchema: z.ZodType<Prisma.DentalTherapySumOrderByAggregateInput> = z.object({
  teeth: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const MerchantListRelationFilterSchema: z.ZodType<Prisma.MerchantListRelationFilter> = z.object({
  every: z.lazy(() => MerchantWhereInputSchema).optional(),
  some: z.lazy(() => MerchantWhereInputSchema).optional(),
  none: z.lazy(() => MerchantWhereInputSchema).optional()
}).strict();

export const MerchantOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MerchantOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationCountOrderByAggregateInputSchema: z.ZodType<Prisma.LocationCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  ip: z.lazy(() => SortOrderSchema).optional(),
  latitude: z.lazy(() => SortOrderSchema).optional(),
  longitude: z.lazy(() => SortOrderSchema).optional(),
  altitude: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  altitudeAccuracy: z.lazy(() => SortOrderSchema).optional(),
  heading: z.lazy(() => SortOrderSchema).optional(),
  speed: z.lazy(() => SortOrderSchema).optional(),
  continent_code: z.lazy(() => SortOrderSchema).optional(),
  continent_name: z.lazy(() => SortOrderSchema).optional(),
  country_code: z.lazy(() => SortOrderSchema).optional(),
  country_name: z.lazy(() => SortOrderSchema).optional(),
  subdivision_code: z.lazy(() => SortOrderSchema).optional(),
  subdivision_name: z.lazy(() => SortOrderSchema).optional(),
  city_name: z.lazy(() => SortOrderSchema).optional(),
  postal_code: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LocationAvgOrderByAggregateInput> = z.object({
  latitude: z.lazy(() => SortOrderSchema).optional(),
  longitude: z.lazy(() => SortOrderSchema).optional(),
  altitude: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  altitudeAccuracy: z.lazy(() => SortOrderSchema).optional(),
  heading: z.lazy(() => SortOrderSchema).optional(),
  speed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  ip: z.lazy(() => SortOrderSchema).optional(),
  latitude: z.lazy(() => SortOrderSchema).optional(),
  longitude: z.lazy(() => SortOrderSchema).optional(),
  altitude: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  altitudeAccuracy: z.lazy(() => SortOrderSchema).optional(),
  heading: z.lazy(() => SortOrderSchema).optional(),
  speed: z.lazy(() => SortOrderSchema).optional(),
  continent_code: z.lazy(() => SortOrderSchema).optional(),
  continent_name: z.lazy(() => SortOrderSchema).optional(),
  country_code: z.lazy(() => SortOrderSchema).optional(),
  country_name: z.lazy(() => SortOrderSchema).optional(),
  subdivision_code: z.lazy(() => SortOrderSchema).optional(),
  subdivision_name: z.lazy(() => SortOrderSchema).optional(),
  city_name: z.lazy(() => SortOrderSchema).optional(),
  postal_code: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationMinOrderByAggregateInputSchema: z.ZodType<Prisma.LocationMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  ip: z.lazy(() => SortOrderSchema).optional(),
  latitude: z.lazy(() => SortOrderSchema).optional(),
  longitude: z.lazy(() => SortOrderSchema).optional(),
  altitude: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  altitudeAccuracy: z.lazy(() => SortOrderSchema).optional(),
  heading: z.lazy(() => SortOrderSchema).optional(),
  speed: z.lazy(() => SortOrderSchema).optional(),
  continent_code: z.lazy(() => SortOrderSchema).optional(),
  continent_name: z.lazy(() => SortOrderSchema).optional(),
  country_code: z.lazy(() => SortOrderSchema).optional(),
  country_name: z.lazy(() => SortOrderSchema).optional(),
  subdivision_code: z.lazy(() => SortOrderSchema).optional(),
  subdivision_name: z.lazy(() => SortOrderSchema).optional(),
  city_name: z.lazy(() => SortOrderSchema).optional(),
  postal_code: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationSumOrderByAggregateInputSchema: z.ZodType<Prisma.LocationSumOrderByAggregateInput> = z.object({
  latitude: z.lazy(() => SortOrderSchema).optional(),
  longitude: z.lazy(() => SortOrderSchema).optional(),
  altitude: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  altitudeAccuracy: z.lazy(() => SortOrderSchema).optional(),
  heading: z.lazy(() => SortOrderSchema).optional(),
  speed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const UserNullableRelationFilterSchema: z.ZodType<Prisma.UserNullableRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const DentalTherapyListRelationFilterSchema: z.ZodType<Prisma.DentalTherapyListRelationFilter> = z.object({
  every: z.lazy(() => DentalTherapyWhereInputSchema).optional(),
  some: z.lazy(() => DentalTherapyWhereInputSchema).optional(),
  none: z.lazy(() => DentalTherapyWhereInputSchema).optional()
}).strict();

export const DentalTherapyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DentalTherapyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MaterialCountOrderByAggregateInputSchema: z.ZodType<Prisma.MaterialCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  longdescription: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MaterialAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MaterialAvgOrderByAggregateInput> = z.object({
  weight: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MaterialMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MaterialMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  longdescription: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MaterialMinOrderByAggregateInputSchema: z.ZodType<Prisma.MaterialMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  longdescription: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  manufacturer: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MaterialSumOrderByAggregateInputSchema: z.ZodType<Prisma.MaterialSumOrderByAggregateInput> = z.object({
  weight: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LocationNullableRelationFilterSchema: z.ZodType<Prisma.LocationNullableRelationFilter> = z.object({
  is: z.lazy(() => LocationWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => LocationWhereInputSchema).optional().nullable()
}).strict();

export const MerchantCountOrderByAggregateInputSchema: z.ZodType<Prisma.MerchantCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  locationRef: z.lazy(() => SortOrderSchema).optional(),
  contact: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MerchantMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MerchantMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  locationRef: z.lazy(() => SortOrderSchema).optional(),
  contact: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const MerchantMinOrderByAggregateInputSchema: z.ZodType<Prisma.MerchantMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  locationRef: z.lazy(() => SortOrderSchema).optional(),
  contact: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumOrganizationRoleFilterSchema: z.ZodType<Prisma.EnumOrganizationRoleFilter> = z.object({
  equals: z.lazy(() => OrganizationRoleSchema).optional(),
  in: z.lazy(() => OrganizationRoleSchema).array().optional(),
  notIn: z.lazy(() => OrganizationRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => NestedEnumOrganizationRoleFilterSchema) ]).optional(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const OrganizationRelationFilterSchema: z.ZodType<Prisma.OrganizationRelationFilter> = z.object({
  is: z.lazy(() => OrganizationWhereInputSchema).optional(),
  isNot: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationMemberCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMemberCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMemberMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMemberMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMemberMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMemberMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumOrganizationRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumOrganizationRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrganizationRoleSchema).optional(),
  in: z.lazy(() => OrganizationRoleSchema).array().optional(),
  notIn: z.lazy(() => OrganizationRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => NestedEnumOrganizationRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrganizationRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrganizationRoleFilterSchema).optional()
}).strict();

export const OrganizationMemberListRelationFilterSchema: z.ZodType<Prisma.OrganizationMemberListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationMemberWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationMemberWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationMemberWhereInputSchema).optional()
}).strict();

export const UserRecordListRelationFilterSchema: z.ZodType<Prisma.UserRecordListRelationFilter> = z.object({
  every: z.lazy(() => UserRecordWhereInputSchema).optional(),
  some: z.lazy(() => UserRecordWhereInputSchema).optional(),
  none: z.lazy(() => UserRecordWhereInputSchema).optional()
}).strict();

export const UploadListRelationFilterSchema: z.ZodType<Prisma.UploadListRelationFilter> = z.object({
  every: z.lazy(() => UploadWhereInputSchema).optional(),
  some: z.lazy(() => UploadWhereInputSchema).optional(),
  none: z.lazy(() => UploadWhereInputSchema).optional()
}).strict();

export const OAuthConnectionListRelationFilterSchema: z.ZodType<Prisma.OAuthConnectionListRelationFilter> = z.object({
  every: z.lazy(() => oAuthConnectionWhereInputSchema).optional(),
  some: z.lazy(() => oAuthConnectionWhereInputSchema).optional(),
  none: z.lazy(() => oAuthConnectionWhereInputSchema).optional()
}).strict();

export const OAuthRefreshTokenListRelationFilterSchema: z.ZodType<Prisma.OAuthRefreshTokenListRelationFilter> = z.object({
  every: z.lazy(() => oAuthRefreshTokenWhereInputSchema).optional(),
  some: z.lazy(() => oAuthRefreshTokenWhereInputSchema).optional(),
  none: z.lazy(() => oAuthRefreshTokenWhereInputSchema).optional()
}).strict();

export const OverallCollectedAccuracyListRelationFilterSchema: z.ZodType<Prisma.OverallCollectedAccuracyListRelationFilter> = z.object({
  every: z.lazy(() => OverallCollectedAccuracyWhereInputSchema).optional(),
  some: z.lazy(() => OverallCollectedAccuracyWhereInputSchema).optional(),
  none: z.lazy(() => OverallCollectedAccuracyWhereInputSchema).optional()
}).strict();

export const OrganizationMemberOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationMemberOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRecordOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserRecordOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UploadOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UploadOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const oAuthConnectionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.oAuthConnectionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const oAuthRefreshTokenOrderByRelationAggregateInputSchema: z.ZodType<Prisma.oAuthRefreshTokenOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OverallCollectedAccuracyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  redirecturl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  redirecturl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizationMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  redirecturl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const EnumRecordCategoryFilterSchema: z.ZodType<Prisma.EnumRecordCategoryFilter> = z.object({
  equals: z.lazy(() => RecordCategorySchema).optional(),
  in: z.lazy(() => RecordCategorySchema).array().optional(),
  notIn: z.lazy(() => RecordCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => NestedEnumRecordCategoryFilterSchema) ]).optional(),
}).strict();

export const EnumRecordTagNullableListFilterSchema: z.ZodType<Prisma.EnumRecordTagNullableListFilter> = z.object({
  equals: z.lazy(() => RecordTagSchema).array().optional().nullable(),
  has: z.lazy(() => RecordTagSchema).optional().nullable(),
  hasEvery: z.lazy(() => RecordTagSchema).array().optional(),
  hasSome: z.lazy(() => RecordTagSchema).array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const UserRecordCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserRecordCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  outdated: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRecordAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserRecordAvgOrderByAggregateInput> = z.object({
  accuracy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRecordMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserRecordMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  outdated: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRecordMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserRecordMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  outdated: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRecordSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserRecordSumOrderByAggregateInput> = z.object({
  accuracy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const EnumRecordCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRecordCategoryWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RecordCategorySchema).optional(),
  in: z.lazy(() => RecordCategorySchema).array().optional(),
  notIn: z.lazy(() => RecordCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => NestedEnumRecordCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRecordCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRecordCategoryFilterSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const OverallCollectedAccuracyCountOrderByAggregateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OverallCollectedAccuracyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyAvgOrderByAggregateInput> = z.object({
  accuracy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OverallCollectedAccuracyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OverallCollectedAccuracyMinOrderByAggregateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OverallCollectedAccuracySumOrderByAggregateInputSchema: z.ZodType<Prisma.OverallCollectedAccuracySumOrderByAggregateInput> = z.object({
  accuracy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UploadCountOrderByAggregateInputSchema: z.ZodType<Prisma.UploadCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  filename: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  mimetype: z.lazy(() => SortOrderSchema).optional(),
  encoding: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UploadMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UploadMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  filename: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  mimetype: z.lazy(() => SortOrderSchema).optional(),
  encoding: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UploadMinOrderByAggregateInputSchema: z.ZodType<Prisma.UploadMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  filename: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  mimetype: z.lazy(() => SortOrderSchema).optional(),
  encoding: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const oAuthRefreshTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const oAuthRefreshTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.oAuthRefreshTokenMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const oAuthRefreshTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.oAuthRefreshTokenMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const oAuthConnectionUseruidOrguidCompoundUniqueInputSchema: z.ZodType<Prisma.oAuthConnectionUseruidOrguidCompoundUniqueInput> = z.object({
  useruid: z.string(),
  orguid: z.string()
}).strict();

export const oAuthConnectionCountOrderByAggregateInputSchema: z.ZodType<Prisma.oAuthConnectionCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional(),
  scopes: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const oAuthConnectionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.oAuthConnectionMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const oAuthConnectionMinOrderByAggregateInputSchema: z.ZodType<Prisma.oAuthConnectionMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  orguid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RefreshTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.RefreshTokenCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  ip: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RefreshTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RefreshTokenMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  ip: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RefreshTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.RefreshTokenMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  validUntil: z.lazy(() => SortOrderSchema).optional(),
  ip: z.lazy(() => SortOrderSchema).optional(),
  agent: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTransactionTypeFilterSchema: z.ZodType<Prisma.EnumTransactionTypeFilter> = z.object({
  equals: z.lazy(() => TransactionTypeSchema).optional(),
  in: z.lazy(() => TransactionTypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => NestedEnumTransactionTypeFilterSchema) ]).optional(),
}).strict();

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const MerchantNullableRelationFilterSchema: z.ZodType<Prisma.MerchantNullableRelationFilter> = z.object({
  is: z.lazy(() => MerchantWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => MerchantWhereInputSchema).optional().nullable()
}).strict();

export const TransactionCountOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  merchantRef: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  taxIncluded: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionAvgOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  merchantRef: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  taxIncluded: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionMinOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  merchantRef: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  taxIncluded: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  sha512: z.lazy(() => SortOrderSchema).optional(),
  useruid: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TransactionSumOrderByAggregateInputSchema: z.ZodType<Prisma.TransactionSumOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional(),
  tax: z.lazy(() => SortOrderSchema).optional(),
  accuracy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTransactionTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTransactionTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TransactionTypeSchema).optional(),
  in: z.lazy(() => TransactionTypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => NestedEnumTransactionTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTransactionTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTransactionTypeFilterSchema).optional()
}).strict();

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const RefreshTokenListRelationFilterSchema: z.ZodType<Prisma.RefreshTokenListRelationFilter> = z.object({
  every: z.lazy(() => RefreshTokenWhereInputSchema).optional(),
  some: z.lazy(() => RefreshTokenWhereInputSchema).optional(),
  none: z.lazy(() => RefreshTokenWhereInputSchema).optional()
}).strict();

export const OrganizationListRelationFilterSchema: z.ZodType<Prisma.OrganizationListRelationFilter> = z.object({
  every: z.lazy(() => OrganizationWhereInputSchema).optional(),
  some: z.lazy(() => OrganizationWhereInputSchema).optional(),
  none: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const RefreshTokenOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RefreshTokenOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrganizationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizationOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  uid: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  updated: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DentalTherapyCreateteethInputSchema: z.ZodType<Prisma.DentalTherapyCreateteethInput> = z.object({
  set: z.number().array()
}).strict();

export const MaterialCreateNestedManyWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialCreateNestedManyWithoutDentalTherapyInput> = z.object({
  create: z.union([ z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema).array(),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MaterialCreateOrConnectWithoutDentalTherapyInputSchema),z.lazy(() => MaterialCreateOrConnectWithoutDentalTherapyInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionCreateNestedManyWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutDentalTherapiesInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutDentalTherapiesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MaterialUncheckedCreateNestedManyWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialUncheckedCreateNestedManyWithoutDentalTherapyInput> = z.object({
  create: z.union([ z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema).array(),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MaterialCreateOrConnectWithoutDentalTherapyInputSchema),z.lazy(() => MaterialCreateOrConnectWithoutDentalTherapyInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutDentalTherapiesInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutDentalTherapiesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DentalTherapyUpdateteethInputSchema: z.ZodType<Prisma.DentalTherapyUpdateteethInput> = z.object({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const MaterialUpdateManyWithoutDentalTherapyNestedInputSchema: z.ZodType<Prisma.MaterialUpdateManyWithoutDentalTherapyNestedInput> = z.object({
  create: z.union([ z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema).array(),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MaterialCreateOrConnectWithoutDentalTherapyInputSchema),z.lazy(() => MaterialCreateOrConnectWithoutDentalTherapyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MaterialUpsertWithWhereUniqueWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUpsertWithWhereUniqueWithoutDentalTherapyInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MaterialUpdateWithWhereUniqueWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUpdateWithWhereUniqueWithoutDentalTherapyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MaterialUpdateManyWithWhereWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUpdateManyWithWhereWithoutDentalTherapyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MaterialScalarWhereInputSchema),z.lazy(() => MaterialScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutDentalTherapiesNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutDentalTherapiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutDentalTherapiesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutDentalTherapiesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutDentalTherapiesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutDentalTherapiesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MaterialUncheckedUpdateManyWithoutDentalTherapyNestedInputSchema: z.ZodType<Prisma.MaterialUncheckedUpdateManyWithoutDentalTherapyNestedInput> = z.object({
  create: z.union([ z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema).array(),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MaterialCreateOrConnectWithoutDentalTherapyInputSchema),z.lazy(() => MaterialCreateOrConnectWithoutDentalTherapyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MaterialUpsertWithWhereUniqueWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUpsertWithWhereUniqueWithoutDentalTherapyInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MaterialUpdateWithWhereUniqueWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUpdateWithWhereUniqueWithoutDentalTherapyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MaterialUpdateManyWithWhereWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUpdateManyWithWhereWithoutDentalTherapyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MaterialScalarWhereInputSchema),z.lazy(() => MaterialScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutDentalTherapiesNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutDentalTherapiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutDentalTherapiesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutDentalTherapiesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutDentalTherapiesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutDentalTherapiesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MerchantCreateNestedManyWithoutLocationInputSchema: z.ZodType<Prisma.MerchantCreateNestedManyWithoutLocationInput> = z.object({
  create: z.union([ z.lazy(() => MerchantCreateWithoutLocationInputSchema),z.lazy(() => MerchantCreateWithoutLocationInputSchema).array(),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MerchantCreateOrConnectWithoutLocationInputSchema),z.lazy(() => MerchantCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MerchantCreateManyLocationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MerchantUncheckedCreateNestedManyWithoutLocationInputSchema: z.ZodType<Prisma.MerchantUncheckedCreateNestedManyWithoutLocationInput> = z.object({
  create: z.union([ z.lazy(() => MerchantCreateWithoutLocationInputSchema),z.lazy(() => MerchantCreateWithoutLocationInputSchema).array(),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MerchantCreateOrConnectWithoutLocationInputSchema),z.lazy(() => MerchantCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MerchantCreateManyLocationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const MerchantUpdateManyWithoutLocationNestedInputSchema: z.ZodType<Prisma.MerchantUpdateManyWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => MerchantCreateWithoutLocationInputSchema),z.lazy(() => MerchantCreateWithoutLocationInputSchema).array(),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MerchantCreateOrConnectWithoutLocationInputSchema),z.lazy(() => MerchantCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MerchantUpsertWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => MerchantUpsertWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MerchantCreateManyLocationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MerchantUpdateWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => MerchantUpdateWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MerchantUpdateManyWithWhereWithoutLocationInputSchema),z.lazy(() => MerchantUpdateManyWithWhereWithoutLocationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MerchantScalarWhereInputSchema),z.lazy(() => MerchantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MerchantUncheckedUpdateManyWithoutLocationNestedInputSchema: z.ZodType<Prisma.MerchantUncheckedUpdateManyWithoutLocationNestedInput> = z.object({
  create: z.union([ z.lazy(() => MerchantCreateWithoutLocationInputSchema),z.lazy(() => MerchantCreateWithoutLocationInputSchema).array(),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MerchantCreateOrConnectWithoutLocationInputSchema),z.lazy(() => MerchantCreateOrConnectWithoutLocationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MerchantUpsertWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => MerchantUpsertWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MerchantCreateManyLocationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MerchantWhereUniqueInputSchema),z.lazy(() => MerchantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MerchantUpdateWithWhereUniqueWithoutLocationInputSchema),z.lazy(() => MerchantUpdateWithWhereUniqueWithoutLocationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MerchantUpdateManyWithWhereWithoutLocationInputSchema),z.lazy(() => MerchantUpdateManyWithWhereWithoutLocationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MerchantScalarWhereInputSchema),z.lazy(() => MerchantScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutMaterialsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMaterialsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMaterialsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMaterialsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMaterialsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DentalTherapyCreateNestedManyWithoutMaterialsUsedInputSchema: z.ZodType<Prisma.DentalTherapyCreateNestedManyWithoutMaterialsUsedInput> = z.object({
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema).array(),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DentalTherapyUncheckedCreateNestedManyWithoutMaterialsUsedInputSchema: z.ZodType<Prisma.DentalTherapyUncheckedCreateNestedManyWithoutMaterialsUsedInput> = z.object({
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema).array(),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutMaterialsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutMaterialsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMaterialsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMaterialsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMaterialsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMaterialsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutMaterialsInputSchema),z.lazy(() => UserUpdateWithoutMaterialsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMaterialsInputSchema) ]).optional(),
}).strict();

export const DentalTherapyUpdateManyWithoutMaterialsUsedNestedInputSchema: z.ZodType<Prisma.DentalTherapyUpdateManyWithoutMaterialsUsedNestedInput> = z.object({
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema).array(),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DentalTherapyUpsertWithWhereUniqueWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUpsertWithWhereUniqueWithoutMaterialsUsedInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DentalTherapyUpdateWithWhereUniqueWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUpdateWithWhereUniqueWithoutMaterialsUsedInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DentalTherapyUpdateManyWithWhereWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUpdateManyWithWhereWithoutMaterialsUsedInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DentalTherapyScalarWhereInputSchema),z.lazy(() => DentalTherapyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DentalTherapyUncheckedUpdateManyWithoutMaterialsUsedNestedInputSchema: z.ZodType<Prisma.DentalTherapyUncheckedUpdateManyWithoutMaterialsUsedNestedInput> = z.object({
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema).array(),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DentalTherapyUpsertWithWhereUniqueWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUpsertWithWhereUniqueWithoutMaterialsUsedInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DentalTherapyUpdateWithWhereUniqueWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUpdateWithWhereUniqueWithoutMaterialsUsedInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DentalTherapyUpdateManyWithWhereWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUpdateManyWithWhereWithoutMaterialsUsedInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DentalTherapyScalarWhereInputSchema),z.lazy(() => DentalTherapyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const LocationCreateNestedOneWithoutMerchantInputSchema: z.ZodType<Prisma.LocationCreateNestedOneWithoutMerchantInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutMerchantInputSchema),z.lazy(() => LocationUncheckedCreateWithoutMerchantInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutMerchantInputSchema).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional()
}).strict();

export const TransactionCreateNestedManyWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutMerchantInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutMerchantInputSchema),z.lazy(() => TransactionCreateWithoutMerchantInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutMerchantInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutMerchantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyMerchantInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutMerchantInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutMerchantInputSchema),z.lazy(() => TransactionCreateWithoutMerchantInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutMerchantInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutMerchantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyMerchantInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const LocationUpdateOneWithoutMerchantNestedInputSchema: z.ZodType<Prisma.LocationUpdateOneWithoutMerchantNestedInput> = z.object({
  create: z.union([ z.lazy(() => LocationCreateWithoutMerchantInputSchema),z.lazy(() => LocationUncheckedCreateWithoutMerchantInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LocationCreateOrConnectWithoutMerchantInputSchema).optional(),
  upsert: z.lazy(() => LocationUpsertWithoutMerchantInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LocationWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LocationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LocationUpdateToOneWithWhereWithoutMerchantInputSchema),z.lazy(() => LocationUpdateWithoutMerchantInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutMerchantInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutMerchantNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutMerchantNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutMerchantInputSchema),z.lazy(() => TransactionCreateWithoutMerchantInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutMerchantInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutMerchantInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutMerchantInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutMerchantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyMerchantInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutMerchantInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutMerchantInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutMerchantInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutMerchantInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutMerchantNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutMerchantNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutMerchantInputSchema),z.lazy(() => TransactionCreateWithoutMerchantInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutMerchantInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutMerchantInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutMerchantInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutMerchantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyMerchantInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutMerchantInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutMerchantInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutMerchantInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutMerchantInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutOrganizationMemberOfInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrganizationMemberOfInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMemberOfInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMemberOfInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationMemberOfInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutMembersInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const EnumOrganizationRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumOrganizationRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => OrganizationRoleSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutOrganizationMemberOfNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrganizationMemberOfNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMemberOfInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMemberOfInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationMemberOfInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrganizationMemberOfInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrganizationMemberOfInputSchema),z.lazy(() => UserUpdateWithoutOrganizationMemberOfInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMemberOfInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutMembersNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutMembersInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutMembersInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutMembersInputSchema),z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutOrganizationsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrganizationsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserRecordCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRecordCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserRecordCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRecordCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UploadCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => UploadCreateWithoutOrganizationInputSchema),z.lazy(() => UploadCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UploadCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UploadCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UploadCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const oAuthConnectionCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema).array(),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthConnectionCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const oAuthRefreshTokenCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema).array(),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthRefreshTokenCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OverallCollectedAccuracyCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserRecordUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRecordCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserRecordCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRecordCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UploadUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => UploadCreateWithoutOrganizationInputSchema),z.lazy(() => UploadCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UploadCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UploadCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UploadCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema).array(),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthConnectionCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema).array(),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthRefreshTokenCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInput> = z.object({
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OverallCollectedAccuracyCreateManyOrganizationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutOrganizationsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrganizationsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizationsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrganizationsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrganizationsInputSchema),z.lazy(() => UserUpdateWithoutOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserRecordUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.UserRecordUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRecordCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserRecordCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRecordUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserRecordUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRecordCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRecordUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserRecordUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRecordUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => UserRecordUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRecordScalarWhereInputSchema),z.lazy(() => UserRecordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UploadUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.UploadUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UploadCreateWithoutOrganizationInputSchema),z.lazy(() => UploadCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UploadCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UploadCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UploadUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UploadUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UploadCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UploadUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UploadUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UploadUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => UploadUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UploadScalarWhereInputSchema),z.lazy(() => UploadScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const oAuthConnectionUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema).array(),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => oAuthConnectionUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthConnectionCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => oAuthConnectionUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => oAuthConnectionUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => oAuthConnectionScalarWhereInputSchema),z.lazy(() => oAuthConnectionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema).array(),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => oAuthRefreshTokenUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthRefreshTokenCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => oAuthRefreshTokenUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => oAuthRefreshTokenUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema),z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OverallCollectedAccuracyUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OverallCollectedAccuracyCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema),z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserRecordUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.UserRecordUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRecordCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UserRecordCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRecordUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserRecordUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRecordCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRecordUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UserRecordUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRecordUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => UserRecordUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRecordScalarWhereInputSchema),z.lazy(() => UserRecordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UploadUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => UploadCreateWithoutOrganizationInputSchema),z.lazy(() => UploadCreateWithoutOrganizationInputSchema).array(),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UploadCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => UploadCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UploadUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UploadUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UploadCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UploadUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => UploadUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UploadUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => UploadUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UploadScalarWhereInputSchema),z.lazy(() => UploadScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema).array(),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => oAuthConnectionUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthConnectionCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => oAuthConnectionUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => oAuthConnectionUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => oAuthConnectionScalarWhereInputSchema),z.lazy(() => oAuthConnectionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema).array(),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => oAuthRefreshTokenUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthRefreshTokenCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => oAuthRefreshTokenUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => oAuthRefreshTokenUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema),z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInput> = z.object({
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema).array(),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OverallCollectedAccuracyUpsertWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUpsertWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OverallCollectedAccuracyCreateManyOrganizationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateWithWhereUniqueWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUpdateWithWhereUniqueWithoutOrganizationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateManyWithWhereWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUpdateManyWithWhereWithoutOrganizationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema),z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserRecordCreatetagsInputSchema: z.ZodType<Prisma.UserRecordCreatetagsInput> = z.object({
  set: z.lazy(() => RecordTagSchema).array()
}).strict();

export const UserCreateNestedOneWithoutRecordsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutRecordsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRecordsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRecordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRecordsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutProvidedRecordsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutProvidedRecordsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutProvidedRecordsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutProvidedRecordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutProvidedRecordsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const EnumRecordCategoryFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRecordCategoryFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RecordCategorySchema).optional()
}).strict();

export const UserRecordUpdatetagsInputSchema: z.ZodType<Prisma.UserRecordUpdatetagsInput> = z.object({
  set: z.lazy(() => RecordTagSchema).array().optional(),
  push: z.union([ z.lazy(() => RecordTagSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutRecordsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutRecordsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRecordsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRecordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRecordsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutRecordsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutRecordsInputSchema),z.lazy(() => UserUpdateWithoutRecordsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRecordsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutProvidedRecordsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutProvidedRecordsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutProvidedRecordsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutProvidedRecordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutProvidedRecordsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutProvidedRecordsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutProvidedRecordsInputSchema),z.lazy(() => OrganizationUpdateWithoutProvidedRecordsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutProvidedRecordsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOverallCollectedAccuraciesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => UserUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOverallCollectedAccuraciesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutOverallCollectedAccuraciesInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutOverallCollectedAccuraciesInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutOverallCollectedAccuraciesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOverallCollectedAccuraciesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => UserUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOverallCollectedAccuraciesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOverallCollectedAccuraciesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => UserUpdateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOverallCollectedAccuraciesInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutOverallCollectedAccuraciesNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutOverallCollectedAccuraciesNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutOverallCollectedAccuraciesInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutOverallCollectedAccuraciesInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => OrganizationUpdateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOverallCollectedAccuraciesInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutUploadsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUploadsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUploadsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUploadsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUploadsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutUploadsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutUploadsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUploadsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUploadsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutUploadsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutUploadsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUploadsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUploadsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUploadsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUploadsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUploadsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutUploadsInputSchema),z.lazy(() => UserUpdateWithoutUploadsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUploadsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutUploadsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutUploadsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUploadsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUploadsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutUploadsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutUploadsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutUploadsInputSchema),z.lazy(() => OrganizationUpdateWithoutUploadsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutUploadsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOAuthRefreshTokensInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutOAuthRefreshTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOAuthRefreshTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutOAuthRefreshTokensInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOAuthRefreshTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutOAuthRefreshTokensInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutOAuthRefreshTokensNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOAuthRefreshTokensNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutOAuthRefreshTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOAuthRefreshTokensInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOAuthRefreshTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOAuthRefreshTokensInputSchema),z.lazy(() => UserUpdateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOAuthRefreshTokensInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutOAuthRefreshTokensNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutOAuthRefreshTokensNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOAuthRefreshTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutOAuthRefreshTokensInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutOAuthRefreshTokensInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutOAuthRefreshTokensInputSchema),z.lazy(() => OrganizationUpdateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOAuthRefreshTokensInputSchema) ]).optional(),
}).strict();

export const oAuthConnectionCreatescopesInputSchema: z.ZodType<Prisma.oAuthConnectionCreatescopesInput> = z.object({
  set: z.string().array()
}).strict();

export const UserCreateNestedOneWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOAuthConnectionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOAuthConnectionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOAuthConnectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOAuthConnectionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const OrganizationCreateNestedOneWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.OrganizationCreateNestedOneWithoutOAuthConnectionsInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOAuthConnectionsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOAuthConnectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutOAuthConnectionsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional()
}).strict();

export const oAuthConnectionUpdatescopesInputSchema: z.ZodType<Prisma.oAuthConnectionUpdatescopesInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutOAuthConnectionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOAuthConnectionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutOAuthConnectionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOAuthConnectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOAuthConnectionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOAuthConnectionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOAuthConnectionsInputSchema),z.lazy(() => UserUpdateWithoutOAuthConnectionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOAuthConnectionsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateOneRequiredWithoutOAuthConnectionsNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateOneRequiredWithoutOAuthConnectionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOAuthConnectionsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOAuthConnectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrganizationCreateOrConnectWithoutOAuthConnectionsInputSchema).optional(),
  upsert: z.lazy(() => OrganizationUpsertWithoutOAuthConnectionsInputSchema).optional(),
  connect: z.lazy(() => OrganizationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateToOneWithWhereWithoutOAuthConnectionsInputSchema),z.lazy(() => OrganizationUpdateWithoutOAuthConnectionsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOAuthConnectionsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutRefreshTokensInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutRefreshTokensInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRefreshTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutRefreshTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRefreshTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutRefreshTokensNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutRefreshTokensNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRefreshTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutRefreshTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRefreshTokensInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutRefreshTokensInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutRefreshTokensInputSchema),z.lazy(() => UserUpdateWithoutRefreshTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRefreshTokensInputSchema) ]).optional(),
}).strict();

export const TransactionCreatetagsInputSchema: z.ZodType<Prisma.TransactionCreatetagsInput> = z.object({
  set: z.string().array()
}).strict();

export const MerchantCreateNestedOneWithoutTransactionsInputSchema: z.ZodType<Prisma.MerchantCreateNestedOneWithoutTransactionsInput> = z.object({
  create: z.union([ z.lazy(() => MerchantCreateWithoutTransactionsInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MerchantCreateOrConnectWithoutTransactionsInputSchema).optional(),
  connect: z.lazy(() => MerchantWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutTransactionInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutTransactionInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTransactionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DentalTherapyCreateNestedManyWithoutTransactionsInputSchema: z.ZodType<Prisma.DentalTherapyCreateNestedManyWithoutTransactionsInput> = z.object({
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema).array(),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DentalTherapyCreateOrConnectWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyCreateOrConnectWithoutTransactionsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DentalTherapyUncheckedCreateNestedManyWithoutTransactionsInputSchema: z.ZodType<Prisma.DentalTherapyUncheckedCreateNestedManyWithoutTransactionsInput> = z.object({
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema).array(),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DentalTherapyCreateOrConnectWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyCreateOrConnectWithoutTransactionsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumTransactionTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTransactionTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TransactionTypeSchema).optional()
}).strict();

export const TransactionUpdatetagsInputSchema: z.ZodType<Prisma.TransactionUpdatetagsInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const MerchantUpdateOneWithoutTransactionsNestedInputSchema: z.ZodType<Prisma.MerchantUpdateOneWithoutTransactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => MerchantCreateWithoutTransactionsInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutTransactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MerchantCreateOrConnectWithoutTransactionsInputSchema).optional(),
  upsert: z.lazy(() => MerchantUpsertWithoutTransactionsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => MerchantWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => MerchantWhereInputSchema) ]).optional(),
  connect: z.lazy(() => MerchantWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MerchantUpdateToOneWithWhereWithoutTransactionsInputSchema),z.lazy(() => MerchantUpdateWithoutTransactionsInputSchema),z.lazy(() => MerchantUncheckedUpdateWithoutTransactionsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutTransactionNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutTransactionNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTransactionInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTransactionInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutTransactionInputSchema),z.lazy(() => UserUpdateWithoutTransactionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionInputSchema) ]).optional(),
}).strict();

export const DentalTherapyUpdateManyWithoutTransactionsNestedInputSchema: z.ZodType<Prisma.DentalTherapyUpdateManyWithoutTransactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema).array(),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DentalTherapyCreateOrConnectWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyCreateOrConnectWithoutTransactionsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DentalTherapyUpsertWithWhereUniqueWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUpsertWithWhereUniqueWithoutTransactionsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DentalTherapyUpdateWithWhereUniqueWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUpdateWithWhereUniqueWithoutTransactionsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DentalTherapyUpdateManyWithWhereWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUpdateManyWithWhereWithoutTransactionsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DentalTherapyScalarWhereInputSchema),z.lazy(() => DentalTherapyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DentalTherapyUncheckedUpdateManyWithoutTransactionsNestedInputSchema: z.ZodType<Prisma.DentalTherapyUncheckedUpdateManyWithoutTransactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema).array(),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DentalTherapyCreateOrConnectWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyCreateOrConnectWithoutTransactionsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DentalTherapyUpsertWithWhereUniqueWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUpsertWithWhereUniqueWithoutTransactionsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DentalTherapyWhereUniqueInputSchema),z.lazy(() => DentalTherapyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DentalTherapyUpdateWithWhereUniqueWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUpdateWithWhereUniqueWithoutTransactionsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DentalTherapyUpdateManyWithWhereWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUpdateManyWithWhereWithoutTransactionsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DentalTherapyScalarWhereInputSchema),z.lazy(() => DentalTherapyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RefreshTokenCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RefreshTokenCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenCreateWithoutUserInputSchema).array(),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RefreshTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => RefreshTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RefreshTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema).array(),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthRefreshTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationCreateWithoutOwnerInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserRecordCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserRecordCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserRecordCreateWithoutUserInputSchema),z.lazy(() => UserRecordCreateWithoutUserInputSchema).array(),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRecordCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserRecordCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRecordCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UploadCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UploadCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UploadCreateWithoutUserInputSchema),z.lazy(() => UploadCreateWithoutUserInputSchema).array(),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UploadCreateOrConnectWithoutUserInputSchema),z.lazy(() => UploadCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UploadCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const oAuthConnectionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema).array(),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthConnectionCreateOrConnectWithoutUserInputSchema),z.lazy(() => oAuthConnectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthConnectionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema).array(),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OverallCollectedAccuracyCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MaterialCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MaterialCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MaterialCreateWithoutUserInputSchema),z.lazy(() => MaterialCreateWithoutUserInputSchema).array(),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MaterialCreateOrConnectWithoutUserInputSchema),z.lazy(() => MaterialCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MaterialCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TransactionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutUserInputSchema),z.lazy(() => TransactionCreateWithoutUserInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutUserInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RefreshTokenCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenCreateWithoutUserInputSchema).array(),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RefreshTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => RefreshTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RefreshTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema).array(),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthRefreshTokenCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationCreateWithoutOwnerInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserRecordUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserRecordUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserRecordCreateWithoutUserInputSchema),z.lazy(() => UserRecordCreateWithoutUserInputSchema).array(),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRecordCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserRecordCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRecordCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UploadUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UploadUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UploadCreateWithoutUserInputSchema),z.lazy(() => UploadCreateWithoutUserInputSchema).array(),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UploadCreateOrConnectWithoutUserInputSchema),z.lazy(() => UploadCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UploadCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema).array(),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthConnectionCreateOrConnectWithoutUserInputSchema),z.lazy(() => oAuthConnectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthConnectionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema).array(),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OverallCollectedAccuracyCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MaterialUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MaterialUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MaterialCreateWithoutUserInputSchema),z.lazy(() => MaterialCreateWithoutUserInputSchema).array(),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MaterialCreateOrConnectWithoutUserInputSchema),z.lazy(() => MaterialCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MaterialCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutUserInputSchema),z.lazy(() => TransactionCreateWithoutUserInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutUserInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RefreshTokenUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.RefreshTokenUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RefreshTokenCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenCreateWithoutUserInputSchema).array(),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RefreshTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => RefreshTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RefreshTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RefreshTokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => RefreshTokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RefreshTokenScalarWhereInputSchema),z.lazy(() => RefreshTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema).array(),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => oAuthRefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthRefreshTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => oAuthRefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => oAuthRefreshTokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema),z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationCreateWithoutOwnerInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserRecordUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserRecordUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserRecordCreateWithoutUserInputSchema),z.lazy(() => UserRecordCreateWithoutUserInputSchema).array(),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRecordCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserRecordCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRecordUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserRecordUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRecordCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRecordUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserRecordUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRecordUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserRecordUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRecordScalarWhereInputSchema),z.lazy(() => UserRecordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UploadUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UploadUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UploadCreateWithoutUserInputSchema),z.lazy(() => UploadCreateWithoutUserInputSchema).array(),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UploadCreateOrConnectWithoutUserInputSchema),z.lazy(() => UploadCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UploadUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UploadUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UploadCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UploadUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UploadUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UploadUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UploadUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UploadScalarWhereInputSchema),z.lazy(() => UploadScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const oAuthConnectionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema).array(),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthConnectionCreateOrConnectWithoutUserInputSchema),z.lazy(() => oAuthConnectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => oAuthConnectionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => oAuthConnectionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthConnectionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => oAuthConnectionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => oAuthConnectionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => oAuthConnectionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => oAuthConnectionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => oAuthConnectionScalarWhereInputSchema),z.lazy(() => oAuthConnectionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema).array(),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OverallCollectedAccuracyUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OverallCollectedAccuracyCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema),z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MaterialUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MaterialUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MaterialCreateWithoutUserInputSchema),z.lazy(() => MaterialCreateWithoutUserInputSchema).array(),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MaterialCreateOrConnectWithoutUserInputSchema),z.lazy(() => MaterialCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MaterialUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MaterialUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MaterialCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MaterialUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MaterialUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MaterialUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => MaterialUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MaterialScalarWhereInputSchema),z.lazy(() => MaterialScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutUserInputSchema),z.lazy(() => TransactionCreateWithoutUserInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutUserInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RefreshTokenCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenCreateWithoutUserInputSchema).array(),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RefreshTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => RefreshTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RefreshTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RefreshTokenWhereUniqueInputSchema),z.lazy(() => RefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RefreshTokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => RefreshTokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RefreshTokenScalarWhereInputSchema),z.lazy(() => RefreshTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema).array(),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => oAuthRefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthRefreshTokenCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => oAuthRefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => oAuthRefreshTokenUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema),z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationCreateWithoutOwnerInputSchema).array(),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => OrganizationCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => OrganizationUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationWhereUniqueInputSchema),z.lazy(() => OrganizationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => OrganizationUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => OrganizationUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema).array(),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema),z.lazy(() => OrganizationMemberCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizationMemberCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizationMemberWhereUniqueInputSchema),z.lazy(() => OrganizationMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserRecordUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserRecordCreateWithoutUserInputSchema),z.lazy(() => UserRecordCreateWithoutUserInputSchema).array(),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRecordCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserRecordCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRecordUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserRecordUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRecordCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRecordWhereUniqueInputSchema),z.lazy(() => UserRecordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRecordUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserRecordUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRecordUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserRecordUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRecordScalarWhereInputSchema),z.lazy(() => UserRecordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UploadUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UploadCreateWithoutUserInputSchema),z.lazy(() => UploadCreateWithoutUserInputSchema).array(),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UploadCreateOrConnectWithoutUserInputSchema),z.lazy(() => UploadCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UploadUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UploadUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UploadCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UploadWhereUniqueInputSchema),z.lazy(() => UploadWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UploadUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UploadUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UploadUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UploadUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UploadScalarWhereInputSchema),z.lazy(() => UploadScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema).array(),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => oAuthConnectionCreateOrConnectWithoutUserInputSchema),z.lazy(() => oAuthConnectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => oAuthConnectionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => oAuthConnectionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => oAuthConnectionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => oAuthConnectionWhereUniqueInputSchema),z.lazy(() => oAuthConnectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => oAuthConnectionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => oAuthConnectionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => oAuthConnectionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => oAuthConnectionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => oAuthConnectionScalarWhereInputSchema),z.lazy(() => oAuthConnectionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema).array(),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OverallCollectedAccuracyUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OverallCollectedAccuracyCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema),z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MaterialUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MaterialUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MaterialCreateWithoutUserInputSchema),z.lazy(() => MaterialCreateWithoutUserInputSchema).array(),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MaterialCreateOrConnectWithoutUserInputSchema),z.lazy(() => MaterialCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MaterialUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MaterialUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MaterialCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MaterialWhereUniqueInputSchema),z.lazy(() => MaterialWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MaterialUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => MaterialUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MaterialUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => MaterialUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MaterialScalarWhereInputSchema),z.lazy(() => MaterialScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => TransactionCreateWithoutUserInputSchema),z.lazy(() => TransactionCreateWithoutUserInputSchema).array(),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TransactionCreateOrConnectWithoutUserInputSchema),z.lazy(() => TransactionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TransactionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TransactionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TransactionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TransactionWhereUniqueInputSchema),z.lazy(() => TransactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TransactionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => TransactionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TransactionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => TransactionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedEnumOrganizationRoleFilterSchema: z.ZodType<Prisma.NestedEnumOrganizationRoleFilter> = z.object({
  equals: z.lazy(() => OrganizationRoleSchema).optional(),
  in: z.lazy(() => OrganizationRoleSchema).array().optional(),
  notIn: z.lazy(() => OrganizationRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => NestedEnumOrganizationRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumOrganizationRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumOrganizationRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrganizationRoleSchema).optional(),
  in: z.lazy(() => OrganizationRoleSchema).array().optional(),
  notIn: z.lazy(() => OrganizationRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => NestedEnumOrganizationRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrganizationRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrganizationRoleFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRecordCategoryFilterSchema: z.ZodType<Prisma.NestedEnumRecordCategoryFilter> = z.object({
  equals: z.lazy(() => RecordCategorySchema).optional(),
  in: z.lazy(() => RecordCategorySchema).array().optional(),
  notIn: z.lazy(() => RecordCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => NestedEnumRecordCategoryFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumRecordCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRecordCategoryWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RecordCategorySchema).optional(),
  in: z.lazy(() => RecordCategorySchema).array().optional(),
  notIn: z.lazy(() => RecordCategorySchema).array().optional(),
  not: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => NestedEnumRecordCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRecordCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRecordCategoryFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumTransactionTypeFilterSchema: z.ZodType<Prisma.NestedEnumTransactionTypeFilter> = z.object({
  equals: z.lazy(() => TransactionTypeSchema).optional(),
  in: z.lazy(() => TransactionTypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => NestedEnumTransactionTypeFilterSchema) ]).optional(),
}).strict();

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumTransactionTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTransactionTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TransactionTypeSchema).optional(),
  in: z.lazy(() => TransactionTypeSchema).array().optional(),
  notIn: z.lazy(() => TransactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => NestedEnumTransactionTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTransactionTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTransactionTypeFilterSchema).optional()
}).strict();

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const MaterialCreateWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialCreateWithoutDentalTherapyInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  longdescription: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  sha512: z.string(),
  manufacturer: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutMaterialsInputSchema).optional()
}).strict();

export const MaterialUncheckedCreateWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialUncheckedCreateWithoutDentalTherapyInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  longdescription: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  sha512: z.string(),
  manufacturer: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  useruid: z.string().optional().nullable()
}).strict();

export const MaterialCreateOrConnectWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialCreateOrConnectWithoutDentalTherapyInput> = z.object({
  where: z.lazy(() => MaterialWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema) ]),
}).strict();

export const TransactionCreateWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionCreateWithoutDentalTherapiesInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  merchant: z.lazy(() => MerchantCreateNestedOneWithoutTransactionsInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutTransactionInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutDentalTherapiesInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.string().optional().nullable(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  useruid: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const TransactionCreateOrConnectWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutDentalTherapiesInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema) ]),
}).strict();

export const MaterialUpsertWithWhereUniqueWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialUpsertWithWhereUniqueWithoutDentalTherapyInput> = z.object({
  where: z.lazy(() => MaterialWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MaterialUpdateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUncheckedUpdateWithoutDentalTherapyInputSchema) ]),
  create: z.union([ z.lazy(() => MaterialCreateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutDentalTherapyInputSchema) ]),
}).strict();

export const MaterialUpdateWithWhereUniqueWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialUpdateWithWhereUniqueWithoutDentalTherapyInput> = z.object({
  where: z.lazy(() => MaterialWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MaterialUpdateWithoutDentalTherapyInputSchema),z.lazy(() => MaterialUncheckedUpdateWithoutDentalTherapyInputSchema) ]),
}).strict();

export const MaterialUpdateManyWithWhereWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialUpdateManyWithWhereWithoutDentalTherapyInput> = z.object({
  where: z.lazy(() => MaterialScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MaterialUpdateManyMutationInputSchema),z.lazy(() => MaterialUncheckedUpdateManyWithoutDentalTherapyInputSchema) ]),
}).strict();

export const MaterialScalarWhereInputSchema: z.ZodType<Prisma.MaterialScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MaterialScalarWhereInputSchema),z.lazy(() => MaterialScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MaterialScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MaterialScalarWhereInputSchema),z.lazy(() => MaterialScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  longdescription: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  weight: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  manufacturer: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  useruid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutDentalTherapiesInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutDentalTherapiesInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutDentalTherapiesInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutDentalTherapiesInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutDentalTherapiesInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutDentalTherapiesInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutDentalTherapiesInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutDentalTherapiesInputSchema) ]),
}).strict();

export const TransactionScalarWhereInputSchema: z.ZodType<Prisma.TransactionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TransactionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TransactionScalarWhereInputSchema),z.lazy(() => TransactionScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumTransactionTypeFilterSchema),z.lazy(() => TransactionTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  category: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tags: z.lazy(() => StringNullableListFilterSchema).optional(),
  merchantRef: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  currency: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tax: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  taxIncluded: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  accuracy: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  data: z.lazy(() => JsonNullableFilterSchema).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  useruid: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const MerchantCreateWithoutLocationInputSchema: z.ZodType<Prisma.MerchantCreateWithoutLocationInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  contact: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  Transactions: z.lazy(() => TransactionCreateNestedManyWithoutMerchantInputSchema).optional()
}).strict();

export const MerchantUncheckedCreateWithoutLocationInputSchema: z.ZodType<Prisma.MerchantUncheckedCreateWithoutLocationInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  contact: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  Transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutMerchantInputSchema).optional()
}).strict();

export const MerchantCreateOrConnectWithoutLocationInputSchema: z.ZodType<Prisma.MerchantCreateOrConnectWithoutLocationInput> = z.object({
  where: z.lazy(() => MerchantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MerchantCreateWithoutLocationInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema) ]),
}).strict();

export const MerchantCreateManyLocationInputEnvelopeSchema: z.ZodType<Prisma.MerchantCreateManyLocationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MerchantCreateManyLocationInputSchema),z.lazy(() => MerchantCreateManyLocationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const MerchantUpsertWithWhereUniqueWithoutLocationInputSchema: z.ZodType<Prisma.MerchantUpsertWithWhereUniqueWithoutLocationInput> = z.object({
  where: z.lazy(() => MerchantWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MerchantUpdateWithoutLocationInputSchema),z.lazy(() => MerchantUncheckedUpdateWithoutLocationInputSchema) ]),
  create: z.union([ z.lazy(() => MerchantCreateWithoutLocationInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutLocationInputSchema) ]),
}).strict();

export const MerchantUpdateWithWhereUniqueWithoutLocationInputSchema: z.ZodType<Prisma.MerchantUpdateWithWhereUniqueWithoutLocationInput> = z.object({
  where: z.lazy(() => MerchantWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MerchantUpdateWithoutLocationInputSchema),z.lazy(() => MerchantUncheckedUpdateWithoutLocationInputSchema) ]),
}).strict();

export const MerchantUpdateManyWithWhereWithoutLocationInputSchema: z.ZodType<Prisma.MerchantUpdateManyWithWhereWithoutLocationInput> = z.object({
  where: z.lazy(() => MerchantScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MerchantUpdateManyMutationInputSchema),z.lazy(() => MerchantUncheckedUpdateManyWithoutLocationInputSchema) ]),
}).strict();

export const MerchantScalarWhereInputSchema: z.ZodType<Prisma.MerchantScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MerchantScalarWhereInputSchema),z.lazy(() => MerchantScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MerchantScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MerchantScalarWhereInputSchema),z.lazy(() => MerchantScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  locationRef: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contact: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutMaterialsInputSchema: z.ZodType<Prisma.UserCreateWithoutMaterialsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutMaterialsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMaterialsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutMaterialsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMaterialsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutMaterialsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMaterialsInputSchema) ]),
}).strict();

export const DentalTherapyCreateWithoutMaterialsUsedInputSchema: z.ZodType<Omit<Prisma.DentalTherapyCreateWithoutMaterialsUsedInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.string().optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyCreateteethInputSchema),z.number().array() ]).optional(),
  type: z.string(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // omitted: sha512: z.string(),
  // omitted: created: z.coerce.date().optional(),
  // omitted: updated: z.coerce.date().optional(),
  transactions: z.lazy(() => TransactionCreateNestedManyWithoutDentalTherapiesInputSchema).optional()
}).strict();

export const DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedCreateWithoutMaterialsUsedInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.string().optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyCreateteethInputSchema),z.number().array() ]).optional(),
  type: z.string(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // omitted: sha512: z.string(),
  // omitted: created: z.coerce.date().optional(),
  // omitted: updated: z.coerce.date().optional(),
  transactions: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutDentalTherapiesInputSchema).optional()
}).strict();

export const DentalTherapyCreateOrConnectWithoutMaterialsUsedInputSchema: z.ZodType<Prisma.DentalTherapyCreateOrConnectWithoutMaterialsUsedInput> = z.object({
  where: z.lazy(() => DentalTherapyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema) ]),
}).strict();

export const UserUpsertWithoutMaterialsInputSchema: z.ZodType<Prisma.UserUpsertWithoutMaterialsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutMaterialsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMaterialsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutMaterialsInputSchema),z.lazy(() => UserUncheckedCreateWithoutMaterialsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutMaterialsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMaterialsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutMaterialsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutMaterialsInputSchema) ]),
}).strict();

export const UserUpdateWithoutMaterialsInputSchema: z.ZodType<Prisma.UserUpdateWithoutMaterialsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutMaterialsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMaterialsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const DentalTherapyUpsertWithWhereUniqueWithoutMaterialsUsedInputSchema: z.ZodType<Prisma.DentalTherapyUpsertWithWhereUniqueWithoutMaterialsUsedInput> = z.object({
  where: z.lazy(() => DentalTherapyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DentalTherapyUpdateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUncheckedUpdateWithoutMaterialsUsedInputSchema) ]),
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutMaterialsUsedInputSchema) ]),
}).strict();

export const DentalTherapyUpdateWithWhereUniqueWithoutMaterialsUsedInputSchema: z.ZodType<Prisma.DentalTherapyUpdateWithWhereUniqueWithoutMaterialsUsedInput> = z.object({
  where: z.lazy(() => DentalTherapyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DentalTherapyUpdateWithoutMaterialsUsedInputSchema),z.lazy(() => DentalTherapyUncheckedUpdateWithoutMaterialsUsedInputSchema) ]),
}).strict();

export const DentalTherapyUpdateManyWithWhereWithoutMaterialsUsedInputSchema: z.ZodType<Prisma.DentalTherapyUpdateManyWithWhereWithoutMaterialsUsedInput> = z.object({
  where: z.lazy(() => DentalTherapyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DentalTherapyUpdateManyMutationInputSchema),z.lazy(() => DentalTherapyUncheckedUpdateManyWithoutMaterialsUsedInputSchema) ]),
}).strict();

export const DentalTherapyScalarWhereInputSchema: z.ZodType<Prisma.DentalTherapyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DentalTherapyScalarWhereInputSchema),z.lazy(() => DentalTherapyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DentalTherapyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DentalTherapyScalarWhereInputSchema),z.lazy(() => DentalTherapyScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  teeth: z.lazy(() => IntNullableListFilterSchema).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sha512: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const LocationCreateWithoutMerchantInputSchema: z.ZodType<Prisma.LocationCreateWithoutMerchantInput> = z.object({
  uid: z.string().optional(),
  ip: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  altitudeAccuracy: z.number().optional().nullable(),
  heading: z.number().optional().nullable(),
  speed: z.number().optional().nullable(),
  continent_code: z.string().optional().nullable(),
  continent_name: z.string().optional().nullable(),
  country_code: z.string().optional().nullable(),
  country_name: z.string().optional().nullable(),
  subdivision_code: z.string().optional().nullable(),
  subdivision_name: z.string().optional().nullable(),
  city_name: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string()
}).strict();

export const LocationUncheckedCreateWithoutMerchantInputSchema: z.ZodType<Prisma.LocationUncheckedCreateWithoutMerchantInput> = z.object({
  uid: z.string().optional(),
  ip: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  altitudeAccuracy: z.number().optional().nullable(),
  heading: z.number().optional().nullable(),
  speed: z.number().optional().nullable(),
  continent_code: z.string().optional().nullable(),
  continent_name: z.string().optional().nullable(),
  country_code: z.string().optional().nullable(),
  country_name: z.string().optional().nullable(),
  subdivision_code: z.string().optional().nullable(),
  subdivision_name: z.string().optional().nullable(),
  city_name: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string()
}).strict();

export const LocationCreateOrConnectWithoutMerchantInputSchema: z.ZodType<Prisma.LocationCreateOrConnectWithoutMerchantInput> = z.object({
  where: z.lazy(() => LocationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LocationCreateWithoutMerchantInputSchema),z.lazy(() => LocationUncheckedCreateWithoutMerchantInputSchema) ]),
}).strict();

export const TransactionCreateWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionCreateWithoutMerchantInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutTransactionInputSchema).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyCreateNestedManyWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutMerchantInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  useruid: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUncheckedCreateNestedManyWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionCreateOrConnectWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutMerchantInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutMerchantInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema) ]),
}).strict();

export const TransactionCreateManyMerchantInputEnvelopeSchema: z.ZodType<Prisma.TransactionCreateManyMerchantInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransactionCreateManyMerchantInputSchema),z.lazy(() => TransactionCreateManyMerchantInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const LocationUpsertWithoutMerchantInputSchema: z.ZodType<Prisma.LocationUpsertWithoutMerchantInput> = z.object({
  update: z.union([ z.lazy(() => LocationUpdateWithoutMerchantInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutMerchantInputSchema) ]),
  create: z.union([ z.lazy(() => LocationCreateWithoutMerchantInputSchema),z.lazy(() => LocationUncheckedCreateWithoutMerchantInputSchema) ]),
  where: z.lazy(() => LocationWhereInputSchema).optional()
}).strict();

export const LocationUpdateToOneWithWhereWithoutMerchantInputSchema: z.ZodType<Prisma.LocationUpdateToOneWithWhereWithoutMerchantInput> = z.object({
  where: z.lazy(() => LocationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LocationUpdateWithoutMerchantInputSchema),z.lazy(() => LocationUncheckedUpdateWithoutMerchantInputSchema) ]),
}).strict();

export const LocationUpdateWithoutMerchantInputSchema: z.ZodType<Prisma.LocationUpdateWithoutMerchantInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  longitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  altitude: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  heading: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  postal_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LocationUncheckedUpdateWithoutMerchantInputSchema: z.ZodType<Prisma.LocationUncheckedUpdateWithoutMerchantInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  latitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  longitude: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  altitude: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  altitudeAccuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  heading: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  continent_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subdivision_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  postal_code: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timezone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutMerchantInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutMerchantInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutMerchantInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutMerchantInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutMerchantInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutMerchantInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutMerchantInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutMerchantInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutMerchantInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutMerchantInputSchema) ]),
}).strict();

export const UserCreateWithoutOrganizationMemberOfInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationMemberOfInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationMemberOfInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationMemberOfInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationMemberOfInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationMemberOfInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMemberOfInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMemberOfInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutMembersInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOrganizationsInputSchema),
  ProvidedRecords: z.lazy(() => UserRecordCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutMembersInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
}).strict();

export const UserUpsertWithoutOrganizationMemberOfInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrganizationMemberOfInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizationMemberOfInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMemberOfInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationMemberOfInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationMemberOfInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOrganizationMemberOfInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrganizationMemberOfInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizationMemberOfInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationMemberOfInputSchema) ]),
}).strict();

export const UserUpdateWithoutOrganizationMemberOfInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizationMemberOfInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationMemberOfInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationMemberOfInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationUpsertWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutMembersInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutMembersInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutMembersInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutMembersInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutMembersInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutMembersInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutMembersInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutMembersInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutOrganizationsInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizationsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOrganizationsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizationsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOrganizationsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizationsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationsInputSchema) ]),
}).strict();

export const OrganizationMemberCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizationMemberOfInputSchema)
}).strict();

export const OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema)
}).strict();

export const OrganizationMemberCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMemberCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.OrganizationMemberCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationMemberCreateManyOrganizationInputSchema),z.lazy(() => OrganizationMemberCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserRecordCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  user: z.lazy(() => UserCreateNestedOneWithoutRecordsInputSchema)
}).strict();

export const UserRecordUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordUncheckedCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  useruid: z.string()
}).strict();

export const UserRecordCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserRecordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserRecordCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.UserRecordCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserRecordCreateManyOrganizationInputSchema),z.lazy(() => UserRecordCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UploadCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  created: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutUploadsInputSchema)
}).strict();

export const UploadUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadUncheckedCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  useruid: z.string(),
  created: z.coerce.date().optional()
}).strict();

export const UploadCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UploadCreateWithoutOrganizationInputSchema),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const UploadCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.UploadCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UploadCreateManyOrganizationInputSchema),z.lazy(() => UploadCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const oAuthConnectionCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOAuthConnectionsInputSchema)
}).strict();

export const oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthConnectionCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => oAuthConnectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const oAuthConnectionCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.oAuthConnectionCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => oAuthConnectionCreateManyOrganizationInputSchema),z.lazy(() => oAuthConnectionCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const oAuthRefreshTokenCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutOAuthRefreshTokensInputSchema)
}).strict();

export const oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  useruid: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date()
}).strict();

export const oAuthRefreshTokenCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const oAuthRefreshTokenCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => oAuthRefreshTokenCreateManyOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OverallCollectedAccuracyCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  accuracy: z.number(),
  created: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOverallCollectedAccuraciesInputSchema)
}).strict();

export const OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  accuracy: z.number(),
  created: z.coerce.date().optional()
}).strict();

export const OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateOrConnectWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OverallCollectedAccuracyCreateManyOrganizationInputEnvelopeSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateManyOrganizationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OverallCollectedAccuracyCreateManyOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyCreateManyOrganizationInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutOrganizationsInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrganizationsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizationsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOrganizationsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOrganizationsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrganizationsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizationsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOrganizationsInputSchema) ]),
}).strict();

export const UserUpdateWithoutOrganizationsInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizationsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOrganizationsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizationsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationMemberUpdateWithoutOrganizationInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMemberUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OrganizationMemberScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationMemberUpdateManyMutationInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const OrganizationMemberScalarWhereInputSchema: z.ZodType<Prisma.OrganizationMemberScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationMemberScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationMemberScalarWhereInputSchema),z.lazy(() => OrganizationMemberScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => EnumOrganizationRoleFilterSchema),z.lazy(() => OrganizationRoleSchema) ]).optional(),
}).strict();

export const UserRecordUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserRecordWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserRecordUpdateWithoutOrganizationInputSchema),z.lazy(() => UserRecordUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => UserRecordCreateWithoutOrganizationInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserRecordUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserRecordWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserRecordUpdateWithoutOrganizationInputSchema),z.lazy(() => UserRecordUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const UserRecordUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UserRecordScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserRecordUpdateManyMutationInputSchema),z.lazy(() => UserRecordUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const UserRecordScalarWhereInputSchema: z.ZodType<Prisma.UserRecordScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserRecordScalarWhereInputSchema),z.lazy(() => UserRecordScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRecordScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRecordScalarWhereInputSchema),z.lazy(() => UserRecordScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  outdated: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  category: z.union([ z.lazy(() => EnumRecordCategoryFilterSchema),z.lazy(() => RecordCategorySchema) ]).optional(),
  tags: z.lazy(() => EnumRecordTagNullableListFilterSchema).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  accuracy: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const UploadUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UploadUpdateWithoutOrganizationInputSchema),z.lazy(() => UploadUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => UploadCreateWithoutOrganizationInputSchema),z.lazy(() => UploadUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const UploadUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UploadUpdateWithoutOrganizationInputSchema),z.lazy(() => UploadUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const UploadUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => UploadScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UploadUpdateManyMutationInputSchema),z.lazy(() => UploadUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const UploadScalarWhereInputSchema: z.ZodType<Prisma.UploadScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UploadScalarWhereInputSchema),z.lazy(() => UploadScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UploadScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UploadScalarWhereInputSchema),z.lazy(() => UploadScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  filename: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  mimetype: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  encoding: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const oAuthConnectionUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => oAuthConnectionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => oAuthConnectionUpdateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const oAuthConnectionUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => oAuthConnectionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => oAuthConnectionUpdateWithoutOrganizationInputSchema),z.lazy(() => oAuthConnectionUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const oAuthConnectionUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => oAuthConnectionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => oAuthConnectionUpdateManyMutationInputSchema),z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const oAuthConnectionScalarWhereInputSchema: z.ZodType<Prisma.oAuthConnectionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => oAuthConnectionScalarWhereInputSchema),z.lazy(() => oAuthConnectionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => oAuthConnectionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => oAuthConnectionScalarWhereInputSchema),z.lazy(() => oAuthConnectionScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  scopes: z.lazy(() => StringNullableListFilterSchema).optional()
}).strict();

export const oAuthRefreshTokenUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => oAuthRefreshTokenUpdateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const oAuthRefreshTokenUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => oAuthRefreshTokenUpdateWithoutOrganizationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const oAuthRefreshTokenUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema),
  data: z.union([ z.lazy(() => oAuthRefreshTokenUpdateManyMutationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const oAuthRefreshTokenScalarWhereInputSchema: z.ZodType<Prisma.oAuthRefreshTokenScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema),z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema),z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const OverallCollectedAccuracyUpsertWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpsertWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedUpdateWithoutOrganizationInputSchema) ]),
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutOrganizationInputSchema) ]),
}).strict();

export const OverallCollectedAccuracyUpdateWithWhereUniqueWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateWithWhereUniqueWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateWithoutOrganizationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedUpdateWithoutOrganizationInputSchema) ]),
}).strict();

export const OverallCollectedAccuracyUpdateManyWithWhereWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateManyWithWhereWithoutOrganizationInput> = z.object({
  where: z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateManyMutationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationInputSchema) ]),
}).strict();

export const OverallCollectedAccuracyScalarWhereInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema),z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema),z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  orguid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accuracy: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutRecordsInputSchema: z.ZodType<Prisma.UserCreateWithoutRecordsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutRecordsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRecordsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutRecordsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRecordsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutRecordsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRecordsInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutProvidedRecordsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutProvidedRecordsInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutProvidedRecordsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutProvidedRecordsInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutProvidedRecordsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutProvidedRecordsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutProvidedRecordsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutProvidedRecordsInputSchema) ]),
}).strict();

export const UserUpsertWithoutRecordsInputSchema: z.ZodType<Prisma.UserUpsertWithoutRecordsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutRecordsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRecordsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutRecordsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRecordsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutRecordsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutRecordsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutRecordsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRecordsInputSchema) ]),
}).strict();

export const UserUpdateWithoutRecordsInputSchema: z.ZodType<Prisma.UserUpdateWithoutRecordsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutRecordsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRecordsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationUpsertWithoutProvidedRecordsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutProvidedRecordsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutProvidedRecordsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutProvidedRecordsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutProvidedRecordsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutProvidedRecordsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutProvidedRecordsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutProvidedRecordsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutProvidedRecordsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutProvidedRecordsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutProvidedRecordsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutProvidedRecordsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutProvidedRecordsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutProvidedRecordsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.UserCreateWithoutOverallCollectedAccuraciesInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOverallCollectedAccuraciesInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOverallCollectedAccuraciesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => UserUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutOverallCollectedAccuraciesInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutOverallCollectedAccuraciesInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutOverallCollectedAccuraciesInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema) ]),
}).strict();

export const UserUpsertWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.UserUpsertWithoutOverallCollectedAccuraciesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOverallCollectedAccuraciesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => UserUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOverallCollectedAccuraciesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOverallCollectedAccuraciesInputSchema) ]),
}).strict();

export const UserUpdateWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.UserUpdateWithoutOverallCollectedAccuraciesInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOverallCollectedAccuraciesInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationUpsertWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutOverallCollectedAccuraciesInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOverallCollectedAccuraciesInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOverallCollectedAccuraciesInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutOverallCollectedAccuraciesInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutOverallCollectedAccuraciesInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOverallCollectedAccuraciesInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutOverallCollectedAccuraciesInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutOverallCollectedAccuraciesInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutOverallCollectedAccuraciesInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutUploadsInputSchema: z.ZodType<Prisma.UserCreateWithoutUploadsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUploadsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUploadsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUploadsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUploadsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUploadsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUploadsInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutUploadsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutUploadsInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutUploadsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutUploadsInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutUploadsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutUploadsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUploadsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUploadsInputSchema) ]),
}).strict();

export const UserUpsertWithoutUploadsInputSchema: z.ZodType<Prisma.UserUpsertWithoutUploadsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUploadsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUploadsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUploadsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUploadsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutUploadsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUploadsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutUploadsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUploadsInputSchema) ]),
}).strict();

export const UserUpdateWithoutUploadsInputSchema: z.ZodType<Prisma.UserUpdateWithoutUploadsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUploadsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUploadsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationUpsertWithoutUploadsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutUploadsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutUploadsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutUploadsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutUploadsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutUploadsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutUploadsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutUploadsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutUploadsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutUploadsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutUploadsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutUploadsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutUploadsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutUploadsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.UserCreateWithoutOAuthRefreshTokensInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOAuthRefreshTokensInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOAuthRefreshTokensInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutOAuthRefreshTokensInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutOAuthRefreshTokensInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutOAuthRefreshTokensInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutOAuthRefreshTokensInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOAuthRefreshTokensInputSchema) ]),
}).strict();

export const UserUpsertWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.UserUpsertWithoutOAuthRefreshTokensInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOAuthRefreshTokensInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutOAuthRefreshTokensInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOAuthRefreshTokensInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOAuthRefreshTokensInputSchema) ]),
}).strict();

export const UserUpdateWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.UserUpdateWithoutOAuthRefreshTokensInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOAuthRefreshTokensInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationUpsertWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutOAuthRefreshTokensInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOAuthRefreshTokensInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOAuthRefreshTokensInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutOAuthRefreshTokensInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutOAuthRefreshTokensInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOAuthRefreshTokensInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutOAuthRefreshTokensInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutOAuthRefreshTokensInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutOAuthRefreshTokensInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.UserCreateWithoutOAuthConnectionsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOAuthConnectionsInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOAuthConnectionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOAuthConnectionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOAuthConnectionsInputSchema) ]),
}).strict();

export const OrganizationCreateWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutOAuthConnectionsInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOrganizationsInputSchema),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutOAuthConnectionsInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutOAuthConnectionsInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOAuthConnectionsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOAuthConnectionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutOAuthConnectionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutOAuthConnectionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOAuthConnectionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOAuthConnectionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutOAuthConnectionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOAuthConnectionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOAuthConnectionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutOAuthConnectionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutOAuthConnectionsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOAuthConnectionsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const OrganizationUpsertWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.OrganizationUpsertWithoutOAuthConnectionsInput> = z.object({
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutOAuthConnectionsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOAuthConnectionsInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOAuthConnectionsInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOAuthConnectionsInputSchema) ]),
  where: z.lazy(() => OrganizationWhereInputSchema).optional()
}).strict();

export const OrganizationUpdateToOneWithWhereWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.OrganizationUpdateToOneWithWhereWithoutOAuthConnectionsInput> = z.object({
  where: z.lazy(() => OrganizationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutOAuthConnectionsInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOAuthConnectionsInputSchema) ]),
}).strict();

export const OrganizationUpdateWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutOAuthConnectionsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationsNestedInputSchema).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutOAuthConnectionsInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutOAuthConnectionsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutRefreshTokensInputSchema: z.ZodType<Prisma.UserCreateWithoutRefreshTokensInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutRefreshTokensInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRefreshTokensInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutRefreshTokensInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRefreshTokensInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutRefreshTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutRefreshTokensInputSchema) ]),
}).strict();

export const UserUpsertWithoutRefreshTokensInputSchema: z.ZodType<Prisma.UserUpsertWithoutRefreshTokensInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutRefreshTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRefreshTokensInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutRefreshTokensInputSchema),z.lazy(() => UserUncheckedCreateWithoutRefreshTokensInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutRefreshTokensInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutRefreshTokensInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutRefreshTokensInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRefreshTokensInputSchema) ]),
}).strict();

export const UserUpdateWithoutRefreshTokensInputSchema: z.ZodType<Prisma.UserUpdateWithoutRefreshTokensInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutRefreshTokensInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRefreshTokensInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Transaction: z.lazy(() => TransactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const MerchantCreateWithoutTransactionsInputSchema: z.ZodType<Prisma.MerchantCreateWithoutTransactionsInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  contact: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  location: z.lazy(() => LocationCreateNestedOneWithoutMerchantInputSchema).optional()
}).strict();

export const MerchantUncheckedCreateWithoutTransactionsInputSchema: z.ZodType<Prisma.MerchantUncheckedCreateWithoutTransactionsInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  locationRef: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const MerchantCreateOrConnectWithoutTransactionsInputSchema: z.ZodType<Prisma.MerchantCreateOrConnectWithoutTransactionsInput> = z.object({
  where: z.lazy(() => MerchantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MerchantCreateWithoutTransactionsInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutTransactionsInputSchema) ]),
}).strict();

export const UserCreateWithoutTransactionInputSchema: z.ZodType<Prisma.UserCreateWithoutTransactionInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTransactionInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTransactionInput> = z.object({
  uid: z.string().optional(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTransactionInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTransactionInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionInputSchema) ]),
}).strict();

export const DentalTherapyCreateWithoutTransactionsInputSchema: z.ZodType<Omit<Prisma.DentalTherapyCreateWithoutTransactionsInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.string().optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyCreateteethInputSchema),z.number().array() ]).optional(),
  type: z.string(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // omitted: sha512: z.string(),
  // omitted: created: z.coerce.date().optional(),
  // omitted: updated: z.coerce.date().optional(),
  materialsUsed: z.lazy(() => MaterialCreateNestedManyWithoutDentalTherapyInputSchema).optional()
}).strict();

export const DentalTherapyUncheckedCreateWithoutTransactionsInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedCreateWithoutTransactionsInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.string().optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyCreateteethInputSchema),z.number().array() ]).optional(),
  type: z.string(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // omitted: sha512: z.string(),
  // omitted: created: z.coerce.date().optional(),
  // omitted: updated: z.coerce.date().optional(),
  materialsUsed: z.lazy(() => MaterialUncheckedCreateNestedManyWithoutDentalTherapyInputSchema).optional()
}).strict();

export const DentalTherapyCreateOrConnectWithoutTransactionsInputSchema: z.ZodType<Prisma.DentalTherapyCreateOrConnectWithoutTransactionsInput> = z.object({
  where: z.lazy(() => DentalTherapyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema) ]),
}).strict();

export const MerchantUpsertWithoutTransactionsInputSchema: z.ZodType<Prisma.MerchantUpsertWithoutTransactionsInput> = z.object({
  update: z.union([ z.lazy(() => MerchantUpdateWithoutTransactionsInputSchema),z.lazy(() => MerchantUncheckedUpdateWithoutTransactionsInputSchema) ]),
  create: z.union([ z.lazy(() => MerchantCreateWithoutTransactionsInputSchema),z.lazy(() => MerchantUncheckedCreateWithoutTransactionsInputSchema) ]),
  where: z.lazy(() => MerchantWhereInputSchema).optional()
}).strict();

export const MerchantUpdateToOneWithWhereWithoutTransactionsInputSchema: z.ZodType<Prisma.MerchantUpdateToOneWithWhereWithoutTransactionsInput> = z.object({
  where: z.lazy(() => MerchantWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MerchantUpdateWithoutTransactionsInputSchema),z.lazy(() => MerchantUncheckedUpdateWithoutTransactionsInputSchema) ]),
}).strict();

export const MerchantUpdateWithoutTransactionsInputSchema: z.ZodType<Prisma.MerchantUpdateWithoutTransactionsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.lazy(() => LocationUpdateOneWithoutMerchantNestedInputSchema).optional()
}).strict();

export const MerchantUncheckedUpdateWithoutTransactionsInputSchema: z.ZodType<Prisma.MerchantUncheckedUpdateWithoutTransactionsInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  locationRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpsertWithoutTransactionInputSchema: z.ZodType<Prisma.UserUpsertWithoutTransactionInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutTransactionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTransactionInputSchema),z.lazy(() => UserUncheckedCreateWithoutTransactionInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutTransactionInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutTransactionInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutTransactionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTransactionInputSchema) ]),
}).strict();

export const UserUpdateWithoutTransactionInputSchema: z.ZodType<Prisma.UserUpdateWithoutTransactionInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTransactionInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTransactionInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  RefreshTokens: z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Organizations: z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  OrganizationMemberOf: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Records: z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Materials: z.lazy(() => MaterialUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const DentalTherapyUpsertWithWhereUniqueWithoutTransactionsInputSchema: z.ZodType<Prisma.DentalTherapyUpsertWithWhereUniqueWithoutTransactionsInput> = z.object({
  where: z.lazy(() => DentalTherapyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DentalTherapyUpdateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUncheckedUpdateWithoutTransactionsInputSchema) ]),
  create: z.union([ z.lazy(() => DentalTherapyCreateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUncheckedCreateWithoutTransactionsInputSchema) ]),
}).strict();

export const DentalTherapyUpdateWithWhereUniqueWithoutTransactionsInputSchema: z.ZodType<Prisma.DentalTherapyUpdateWithWhereUniqueWithoutTransactionsInput> = z.object({
  where: z.lazy(() => DentalTherapyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DentalTherapyUpdateWithoutTransactionsInputSchema),z.lazy(() => DentalTherapyUncheckedUpdateWithoutTransactionsInputSchema) ]),
}).strict();

export const DentalTherapyUpdateManyWithWhereWithoutTransactionsInputSchema: z.ZodType<Prisma.DentalTherapyUpdateManyWithWhereWithoutTransactionsInput> = z.object({
  where: z.lazy(() => DentalTherapyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DentalTherapyUpdateManyMutationInputSchema),z.lazy(() => DentalTherapyUncheckedUpdateManyWithoutTransactionsInputSchema) ]),
}).strict();

export const RefreshTokenCreateWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  ip: z.string().optional().nullable(),
  agent: z.string().optional().nullable()
}).strict();

export const RefreshTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  ip: z.string().optional().nullable(),
  agent: z.string().optional().nullable()
}).strict();

export const RefreshTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => RefreshTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RefreshTokenCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RefreshTokenCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.RefreshTokenCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RefreshTokenCreateManyUserInputSchema),z.lazy(() => RefreshTokenCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const oAuthRefreshTokenCreateWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutOAuthRefreshTokensInputSchema)
}).strict();

export const oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date()
}).strict();

export const oAuthRefreshTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const oAuthRefreshTokenCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => oAuthRefreshTokenCreateManyUserInputSchema),z.lazy(() => oAuthRefreshTokenCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationCreateWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationCreateWithoutOwnerInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  members: z.lazy(() => OrganizationMemberCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationUncheckedCreateWithoutOwnerInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string(),
  members: z.lazy(() => OrganizationMemberUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedCreateNestedManyWithoutOrganizationInputSchema).optional()
}).strict();

export const OrganizationCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const OrganizationCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.OrganizationCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationCreateManyOwnerInputSchema),z.lazy(() => OrganizationCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OrganizationMemberCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutMembersInputSchema)
}).strict();

export const OrganizationMemberUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema)
}).strict();

export const OrganizationMemberCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMemberCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.OrganizationMemberCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OrganizationMemberCreateManyUserInputSchema),z.lazy(() => OrganizationMemberCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserRecordCreateWithoutUserInputSchema: z.ZodType<Prisma.UserRecordCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutProvidedRecordsInputSchema)
}).strict();

export const UserRecordUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserRecordUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  orguid: z.string()
}).strict();

export const UserRecordCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserRecordCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserRecordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserRecordCreateWithoutUserInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserRecordCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserRecordCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserRecordCreateManyUserInputSchema),z.lazy(() => UserRecordCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UploadCreateWithoutUserInputSchema: z.ZodType<Prisma.UploadCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  created: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutUploadsInputSchema)
}).strict();

export const UploadUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UploadUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional()
}).strict();

export const UploadCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UploadCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UploadCreateWithoutUserInputSchema),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UploadCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UploadCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UploadCreateManyUserInputSchema),z.lazy(() => UploadCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const oAuthConnectionCreateWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutOAuthConnectionsInputSchema)
}).strict();

export const oAuthConnectionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthConnectionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => oAuthConnectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const oAuthConnectionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.oAuthConnectionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => oAuthConnectionCreateManyUserInputSchema),z.lazy(() => oAuthConnectionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OverallCollectedAccuracyCreateWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  accuracy: z.number(),
  created: z.coerce.date().optional(),
  organization: z.lazy(() => OrganizationCreateNestedOneWithoutOverallCollectedAccuraciesInputSchema)
}).strict();

export const OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  orguid: z.string(),
  accuracy: z.number(),
  created: z.coerce.date().optional()
}).strict();

export const OverallCollectedAccuracyCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OverallCollectedAccuracyCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OverallCollectedAccuracyCreateManyUserInputSchema),z.lazy(() => OverallCollectedAccuracyCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const MaterialCreateWithoutUserInputSchema: z.ZodType<Prisma.MaterialCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  longdescription: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  sha512: z.string(),
  manufacturer: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  DentalTherapy: z.lazy(() => DentalTherapyCreateNestedManyWithoutMaterialsUsedInputSchema).optional()
}).strict();

export const MaterialUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.MaterialUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  longdescription: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  sha512: z.string(),
  manufacturer: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  DentalTherapy: z.lazy(() => DentalTherapyUncheckedCreateNestedManyWithoutMaterialsUsedInputSchema).optional()
}).strict();

export const MaterialCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.MaterialCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => MaterialWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MaterialCreateWithoutUserInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MaterialCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.MaterialCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MaterialCreateManyUserInputSchema),z.lazy(() => MaterialCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TransactionCreateWithoutUserInputSchema: z.ZodType<Prisma.TransactionCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  merchant: z.lazy(() => MerchantCreateNestedOneWithoutTransactionsInputSchema).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyCreateNestedManyWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.TransactionUncheckedCreateWithoutUserInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.string().optional().nullable(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUncheckedCreateNestedManyWithoutTransactionsInputSchema).optional()
}).strict();

export const TransactionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.TransactionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TransactionCreateWithoutUserInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TransactionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.TransactionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TransactionCreateManyUserInputSchema),z.lazy(() => TransactionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => RefreshTokenWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RefreshTokenUpdateWithoutUserInputSchema),z.lazy(() => RefreshTokenUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => RefreshTokenCreateWithoutUserInputSchema),z.lazy(() => RefreshTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => RefreshTokenWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RefreshTokenUpdateWithoutUserInputSchema),z.lazy(() => RefreshTokenUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const RefreshTokenUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => RefreshTokenScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RefreshTokenUpdateManyMutationInputSchema),z.lazy(() => RefreshTokenUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const RefreshTokenScalarWhereInputSchema: z.ZodType<Prisma.RefreshTokenScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RefreshTokenScalarWhereInputSchema),z.lazy(() => RefreshTokenScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RefreshTokenScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RefreshTokenScalarWhereInputSchema),z.lazy(() => RefreshTokenScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  useruid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  validUntil: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ip: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  agent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const oAuthRefreshTokenUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => oAuthRefreshTokenUpdateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => oAuthRefreshTokenCreateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const oAuthRefreshTokenUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => oAuthRefreshTokenWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => oAuthRefreshTokenUpdateWithoutUserInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const oAuthRefreshTokenUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => oAuthRefreshTokenScalarWhereInputSchema),
  data: z.union([ z.lazy(() => oAuthRefreshTokenUpdateManyMutationInputSchema),z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const OrganizationUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationUpdateWithoutOwnerInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationCreateWithoutOwnerInputSchema),z.lazy(() => OrganizationUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const OrganizationUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => OrganizationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateWithoutOwnerInputSchema),z.lazy(() => OrganizationUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const OrganizationUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => OrganizationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationUpdateManyMutationInputSchema),z.lazy(() => OrganizationUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const OrganizationScalarWhereInputSchema: z.ZodType<Prisma.OrganizationScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizationScalarWhereInputSchema),z.lazy(() => OrganizationScalarWhereInputSchema).array() ]).optional(),
  uid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ownerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  redirecturl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const OrganizationMemberUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizationMemberUpdateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizationMemberCreateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMemberUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMemberWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizationMemberUpdateWithoutUserInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const OrganizationMemberUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => OrganizationMemberScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizationMemberUpdateManyMutationInputSchema),z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const UserRecordUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserRecordUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserRecordWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserRecordUpdateWithoutUserInputSchema),z.lazy(() => UserRecordUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserRecordCreateWithoutUserInputSchema),z.lazy(() => UserRecordUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserRecordUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserRecordUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserRecordWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserRecordUpdateWithoutUserInputSchema),z.lazy(() => UserRecordUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserRecordUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserRecordUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserRecordScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserRecordUpdateManyMutationInputSchema),z.lazy(() => UserRecordUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const UploadUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UploadUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UploadUpdateWithoutUserInputSchema),z.lazy(() => UploadUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UploadCreateWithoutUserInputSchema),z.lazy(() => UploadUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UploadUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UploadUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UploadWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UploadUpdateWithoutUserInputSchema),z.lazy(() => UploadUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UploadUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UploadUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UploadScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UploadUpdateManyMutationInputSchema),z.lazy(() => UploadUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const oAuthConnectionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => oAuthConnectionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => oAuthConnectionUpdateWithoutUserInputSchema),z.lazy(() => oAuthConnectionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => oAuthConnectionCreateWithoutUserInputSchema),z.lazy(() => oAuthConnectionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const oAuthConnectionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => oAuthConnectionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => oAuthConnectionUpdateWithoutUserInputSchema),z.lazy(() => oAuthConnectionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const oAuthConnectionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => oAuthConnectionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => oAuthConnectionUpdateManyMutationInputSchema),z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const OverallCollectedAccuracyUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => OverallCollectedAccuracyCreateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const OverallCollectedAccuracyUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => OverallCollectedAccuracyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateWithoutUserInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const OverallCollectedAccuracyUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => OverallCollectedAccuracyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OverallCollectedAccuracyUpdateManyMutationInputSchema),z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const MaterialUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MaterialUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MaterialWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MaterialUpdateWithoutUserInputSchema),z.lazy(() => MaterialUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => MaterialCreateWithoutUserInputSchema),z.lazy(() => MaterialUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MaterialUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MaterialUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MaterialWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MaterialUpdateWithoutUserInputSchema),z.lazy(() => MaterialUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const MaterialUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.MaterialUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => MaterialScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MaterialUpdateManyMutationInputSchema),z.lazy(() => MaterialUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const TransactionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TransactionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TransactionUpdateWithoutUserInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => TransactionCreateWithoutUserInputSchema),z.lazy(() => TransactionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const TransactionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.TransactionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => TransactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateWithoutUserInputSchema),z.lazy(() => TransactionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const TransactionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.TransactionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => TransactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TransactionUpdateManyMutationInputSchema),z.lazy(() => TransactionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const MaterialUpdateWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialUpdateWithoutDentalTherapyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutMaterialsNestedInputSchema).optional()
}).strict();

export const MaterialUncheckedUpdateWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialUncheckedUpdateWithoutDentalTherapyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const MaterialUncheckedUpdateManyWithoutDentalTherapyInputSchema: z.ZodType<Prisma.MaterialUncheckedUpdateManyWithoutDentalTherapyInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const TransactionUpdateWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutDentalTherapiesInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  merchant: z.lazy(() => MerchantUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutTransactionNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutDentalTherapiesInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUncheckedUpdateManyWithoutDentalTherapiesInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutDentalTherapiesInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MerchantCreateManyLocationInputSchema: z.ZodType<Prisma.MerchantCreateManyLocationInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  contact: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sha512: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const MerchantUpdateWithoutLocationInputSchema: z.ZodType<Prisma.MerchantUpdateWithoutLocationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Transactions: z.lazy(() => TransactionUpdateManyWithoutMerchantNestedInputSchema).optional()
}).strict();

export const MerchantUncheckedUpdateWithoutLocationInputSchema: z.ZodType<Prisma.MerchantUncheckedUpdateWithoutLocationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutMerchantNestedInputSchema).optional()
}).strict();

export const MerchantUncheckedUpdateManyWithoutLocationInputSchema: z.ZodType<Prisma.MerchantUncheckedUpdateManyWithoutLocationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DentalTherapyUpdateWithoutMaterialsUsedInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUpdateWithoutMaterialsUsedInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionUpdateManyWithoutDentalTherapiesNestedInputSchema).optional()
}).strict();

export const DentalTherapyUncheckedUpdateWithoutMaterialsUsedInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedUpdateWithoutMaterialsUsedInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  transactions: z.lazy(() => TransactionUncheckedUpdateManyWithoutDentalTherapiesNestedInputSchema).optional()
}).strict();

export const DentalTherapyUncheckedUpdateManyWithoutMaterialsUsedInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedUpdateManyWithoutMaterialsUsedInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionCreateManyMerchantInputSchema: z.ZodType<Prisma.TransactionCreateManyMerchantInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  useruid: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const TransactionUpdateWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutMerchantInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutTransactionNestedInputSchema).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUpdateManyWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutMerchantInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUncheckedUpdateManyWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateManyWithoutMerchantInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutMerchantInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  useruid: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberCreateManyOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberCreateManyOrganizationInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema)
}).strict();

export const UserRecordCreateManyOrganizationInputSchema: z.ZodType<Prisma.UserRecordCreateManyOrganizationInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  useruid: z.string()
}).strict();

export const UploadCreateManyOrganizationInputSchema: z.ZodType<Prisma.UploadCreateManyOrganizationInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  useruid: z.string(),
  created: z.coerce.date().optional()
}).strict();

export const oAuthConnectionCreateManyOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionCreateManyOrganizationInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthRefreshTokenCreateManyOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateManyOrganizationInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  useruid: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date()
}).strict();

export const OverallCollectedAccuracyCreateManyOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateManyOrganizationInput> = z.object({
  uid: z.string().optional(),
  useruid: z.string(),
  accuracy: z.number(),
  created: z.coerce.date().optional()
}).strict();

export const OrganizationMemberUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizationMemberOfNestedInputSchema).optional()
}).strict();

export const OrganizationMemberUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRecordUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRecordsNestedInputSchema).optional()
}).strict();

export const UserRecordUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordUncheckedUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRecordUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UserRecordUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UploadUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUploadsNestedInputSchema).optional()
}).strict();

export const UploadUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UploadUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const oAuthConnectionUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOAuthConnectionsNestedInputSchema).optional()
}).strict();

export const oAuthConnectionUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthConnectionUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthRefreshTokenUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOAuthRefreshTokensNestedInputSchema).optional()
}).strict();

export const oAuthRefreshTokenUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OverallCollectedAccuracyUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOverallCollectedAccuraciesNestedInputSchema).optional()
}).strict();

export const OverallCollectedAccuracyUncheckedUpdateWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedUpdateWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  useruid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DentalTherapyUpdateWithoutTransactionsInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUpdateWithoutTransactionsInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  materialsUsed: z.lazy(() => MaterialUpdateManyWithoutDentalTherapyNestedInputSchema).optional()
}).strict();

export const DentalTherapyUncheckedUpdateWithoutTransactionsInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedUpdateWithoutTransactionsInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  materialsUsed: z.lazy(() => MaterialUncheckedUpdateManyWithoutDentalTherapyNestedInputSchema).optional()
}).strict();

export const DentalTherapyUncheckedUpdateManyWithoutTransactionsInputSchema: z.ZodType<Omit<Prisma.DentalTherapyUncheckedUpdateManyWithoutTransactionsInput, "uid" | "sha512" | "created" | "updated">> = z.object({
  // omitted: uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  teeth: z.union([ z.lazy(() => DentalTherapyUpdateteethInputSchema),z.number().array() ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  // omitted: sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RefreshTokenCreateManyUserInputSchema: z.ZodType<Prisma.RefreshTokenCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date(),
  ip: z.string().optional().nullable(),
  agent: z.string().optional().nullable()
}).strict();

export const oAuthRefreshTokenCreateManyUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  token: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  validUntil: z.coerce.date()
}).strict();

export const OrganizationCreateManyOwnerInputSchema: z.ZodType<Prisma.OrganizationCreateManyOwnerInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  redirecturl: z.string()
}).strict();

export const OrganizationMemberCreateManyUserInputSchema: z.ZodType<Prisma.OrganizationMemberCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  role: z.lazy(() => OrganizationRoleSchema)
}).strict();

export const UserRecordCreateManyUserInputSchema: z.ZodType<Prisma.UserRecordCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  outdated: z.boolean().optional(),
  category: z.lazy(() => RecordCategorySchema),
  tags: z.union([ z.lazy(() => UserRecordCreatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  accuracy: z.number(),
  orguid: z.string()
}).strict();

export const UploadCreateManyUserInputSchema: z.ZodType<Prisma.UploadCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  filename: z.string(),
  description: z.string(),
  mimetype: z.string(),
  encoding: z.string(),
  orguid: z.string(),
  created: z.coerce.date().optional()
}).strict();

export const oAuthConnectionCreateManyUserInputSchema: z.ZodType<Prisma.oAuthConnectionCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  orguid: z.string(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionCreatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyCreateManyUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  orguid: z.string(),
  accuracy: z.number(),
  created: z.coerce.date().optional()
}).strict();

export const MaterialCreateManyUserInputSchema: z.ZodType<Prisma.MaterialCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  longdescription: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  sha512: z.string(),
  manufacturer: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const TransactionCreateManyUserInputSchema: z.ZodType<Prisma.TransactionCreateManyUserInput> = z.object({
  uid: z.string().optional(),
  date: z.coerce.date(),
  type: z.lazy(() => TransactionTypeSchema),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionCreatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.string().optional().nullable(),
  amount: z.number(),
  currency: z.string(),
  tax: z.number().optional().nullable(),
  taxIncluded: z.boolean().optional().nullable(),
  accuracy: z.number().optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.string().optional().nullable(),
  sha512: z.string().optional().nullable(),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional()
}).strict();

export const RefreshTokenUpdateWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RefreshTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RefreshTokenUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.RefreshTokenUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ip: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  agent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const oAuthRefreshTokenUpdateWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutOAuthRefreshTokensNestedInputSchema).optional()
}).strict();

export const oAuthRefreshTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const oAuthRefreshTokenUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.oAuthRefreshTokenUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  validUntil: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationUpdateWithoutOwnerInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateWithoutOwnerInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  members: z.lazy(() => OrganizationMemberUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  ProvidedRecords: z.lazy(() => UserRecordUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  Uploads: z.lazy(() => UploadUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthConnections: z.lazy(() => oAuthConnectionUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  oAuthRefreshTokens: z.lazy(() => oAuthRefreshTokenUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional(),
  OverallCollectedAccuracies: z.lazy(() => OverallCollectedAccuracyUncheckedUpdateManyWithoutOrganizationNestedInputSchema).optional()
}).strict();

export const OrganizationUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.OrganizationUncheckedUpdateManyWithoutOwnerInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  redirecturl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutMembersNestedInputSchema).optional()
}).strict();

export const OrganizationMemberUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrganizationMemberUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizationMemberUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => OrganizationRoleSchema),z.lazy(() => EnumOrganizationRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRecordUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserRecordUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutProvidedRecordsNestedInputSchema).optional()
}).strict();

export const UserRecordUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserRecordUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRecordUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.UserRecordUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  outdated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => RecordCategorySchema),z.lazy(() => EnumRecordCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => UserRecordUpdatetagsInputSchema),z.lazy(() => RecordTagSchema).array() ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UploadUpdateWithoutUserInputSchema: z.ZodType<Prisma.UploadUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutUploadsNestedInputSchema).optional()
}).strict();

export const UploadUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UploadUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.UploadUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  filename: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimetype: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  encoding: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const oAuthConnectionUpdateWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutOAuthConnectionsNestedInputSchema).optional()
}).strict();

export const oAuthConnectionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const oAuthConnectionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.oAuthConnectionUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  scopes: z.union([ z.lazy(() => oAuthConnectionUpdatescopesInputSchema),z.string().array() ]).optional(),
}).strict();

export const OverallCollectedAccuracyUpdateWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  organization: z.lazy(() => OrganizationUpdateOneRequiredWithoutOverallCollectedAccuraciesNestedInputSchema).optional()
}).strict();

export const OverallCollectedAccuracyUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OverallCollectedAccuracyUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OverallCollectedAccuracyUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orguid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accuracy: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MaterialUpdateWithoutUserInputSchema: z.ZodType<Prisma.MaterialUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  DentalTherapy: z.lazy(() => DentalTherapyUpdateManyWithoutMaterialsUsedNestedInputSchema).optional()
}).strict();

export const MaterialUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.MaterialUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  DentalTherapy: z.lazy(() => DentalTherapyUncheckedUpdateManyWithoutMaterialsUsedNestedInputSchema).optional()
}).strict();

export const MaterialUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.MaterialUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  longdescription: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weight: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  manufacturer: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TransactionUpdateWithoutUserInputSchema: z.ZodType<Prisma.TransactionUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  merchant: z.lazy(() => MerchantUpdateOneWithoutTransactionsNestedInputSchema).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUpdateManyWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  DentalTherapies: z.lazy(() => DentalTherapyUncheckedUpdateManyWithoutTransactionsNestedInputSchema).optional()
}).strict();

export const TransactionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.TransactionUncheckedUpdateManyWithoutUserInput> = z.object({
  uid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => TransactionTypeSchema),z.lazy(() => EnumTransactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  category: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => TransactionUpdatetagsInputSchema),z.string().array() ]).optional(),
  merchantRef: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tax: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  taxIncluded: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accuracy: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sha512: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const DentalTherapyFindFirstArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyFindFirstArgs, "select" | "include">> = z.object({
  where: DentalTherapyWhereInputSchema.optional(),
  orderBy: z.union([ DentalTherapyOrderByWithRelationInputSchema.array(),DentalTherapyOrderByWithRelationInputSchema ]).optional(),
  cursor: DentalTherapyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DentalTherapyScalarFieldEnumSchema,DentalTherapyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DentalTherapyFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: DentalTherapyWhereInputSchema.optional(),
  orderBy: z.union([ DentalTherapyOrderByWithRelationInputSchema.array(),DentalTherapyOrderByWithRelationInputSchema ]).optional(),
  cursor: DentalTherapyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DentalTherapyScalarFieldEnumSchema,DentalTherapyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DentalTherapyFindManyArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyFindManyArgs, "select" | "include">> = z.object({
  where: DentalTherapyWhereInputSchema.optional(),
  orderBy: z.union([ DentalTherapyOrderByWithRelationInputSchema.array(),DentalTherapyOrderByWithRelationInputSchema ]).optional(),
  cursor: DentalTherapyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DentalTherapyScalarFieldEnumSchema,DentalTherapyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DentalTherapyAggregateArgsSchema: z.ZodType<Prisma.DentalTherapyAggregateArgs> = z.object({
  where: DentalTherapyWhereInputSchema.optional(),
  orderBy: z.union([ DentalTherapyOrderByWithRelationInputSchema.array(),DentalTherapyOrderByWithRelationInputSchema ]).optional(),
  cursor: DentalTherapyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DentalTherapyGroupByArgsSchema: z.ZodType<Prisma.DentalTherapyGroupByArgs> = z.object({
  where: DentalTherapyWhereInputSchema.optional(),
  orderBy: z.union([ DentalTherapyOrderByWithAggregationInputSchema.array(),DentalTherapyOrderByWithAggregationInputSchema ]).optional(),
  by: DentalTherapyScalarFieldEnumSchema.array(),
  having: DentalTherapyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DentalTherapyFindUniqueArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyFindUniqueArgs, "select" | "include">> = z.object({
  where: DentalTherapyWhereUniqueInputSchema,
}).strict() ;

export const DentalTherapyFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: DentalTherapyWhereUniqueInputSchema,
}).strict() ;

export const LocationFindFirstArgsSchema: z.ZodType<Omit<Prisma.LocationFindFirstArgs, "select" | "include">> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.LocationFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationFindManyArgsSchema: z.ZodType<Omit<Prisma.LocationFindManyArgs, "select" | "include">> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LocationScalarFieldEnumSchema,LocationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LocationAggregateArgsSchema: z.ZodType<Prisma.LocationAggregateArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithRelationInputSchema.array(),LocationOrderByWithRelationInputSchema ]).optional(),
  cursor: LocationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LocationGroupByArgsSchema: z.ZodType<Prisma.LocationGroupByArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
  orderBy: z.union([ LocationOrderByWithAggregationInputSchema.array(),LocationOrderByWithAggregationInputSchema ]).optional(),
  by: LocationScalarFieldEnumSchema.array(),
  having: LocationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LocationFindUniqueArgsSchema: z.ZodType<Omit<Prisma.LocationFindUniqueArgs, "select" | "include">> = z.object({
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.LocationFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const MaterialFindFirstArgsSchema: z.ZodType<Omit<Prisma.MaterialFindFirstArgs, "select" | "include">> = z.object({
  where: MaterialWhereInputSchema.optional(),
  orderBy: z.union([ MaterialOrderByWithRelationInputSchema.array(),MaterialOrderByWithRelationInputSchema ]).optional(),
  cursor: MaterialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MaterialScalarFieldEnumSchema,MaterialScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MaterialFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.MaterialFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: MaterialWhereInputSchema.optional(),
  orderBy: z.union([ MaterialOrderByWithRelationInputSchema.array(),MaterialOrderByWithRelationInputSchema ]).optional(),
  cursor: MaterialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MaterialScalarFieldEnumSchema,MaterialScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MaterialFindManyArgsSchema: z.ZodType<Omit<Prisma.MaterialFindManyArgs, "select" | "include">> = z.object({
  where: MaterialWhereInputSchema.optional(),
  orderBy: z.union([ MaterialOrderByWithRelationInputSchema.array(),MaterialOrderByWithRelationInputSchema ]).optional(),
  cursor: MaterialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MaterialScalarFieldEnumSchema,MaterialScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MaterialAggregateArgsSchema: z.ZodType<Prisma.MaterialAggregateArgs> = z.object({
  where: MaterialWhereInputSchema.optional(),
  orderBy: z.union([ MaterialOrderByWithRelationInputSchema.array(),MaterialOrderByWithRelationInputSchema ]).optional(),
  cursor: MaterialWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MaterialGroupByArgsSchema: z.ZodType<Prisma.MaterialGroupByArgs> = z.object({
  where: MaterialWhereInputSchema.optional(),
  orderBy: z.union([ MaterialOrderByWithAggregationInputSchema.array(),MaterialOrderByWithAggregationInputSchema ]).optional(),
  by: MaterialScalarFieldEnumSchema.array(),
  having: MaterialScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MaterialFindUniqueArgsSchema: z.ZodType<Omit<Prisma.MaterialFindUniqueArgs, "select" | "include">> = z.object({
  where: MaterialWhereUniqueInputSchema,
}).strict() ;

export const MaterialFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.MaterialFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: MaterialWhereUniqueInputSchema,
}).strict() ;

export const MerchantFindFirstArgsSchema: z.ZodType<Omit<Prisma.MerchantFindFirstArgs, "select" | "include">> = z.object({
  where: MerchantWhereInputSchema.optional(),
  orderBy: z.union([ MerchantOrderByWithRelationInputSchema.array(),MerchantOrderByWithRelationInputSchema ]).optional(),
  cursor: MerchantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MerchantScalarFieldEnumSchema,MerchantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MerchantFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.MerchantFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: MerchantWhereInputSchema.optional(),
  orderBy: z.union([ MerchantOrderByWithRelationInputSchema.array(),MerchantOrderByWithRelationInputSchema ]).optional(),
  cursor: MerchantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MerchantScalarFieldEnumSchema,MerchantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MerchantFindManyArgsSchema: z.ZodType<Omit<Prisma.MerchantFindManyArgs, "select" | "include">> = z.object({
  where: MerchantWhereInputSchema.optional(),
  orderBy: z.union([ MerchantOrderByWithRelationInputSchema.array(),MerchantOrderByWithRelationInputSchema ]).optional(),
  cursor: MerchantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MerchantScalarFieldEnumSchema,MerchantScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const MerchantAggregateArgsSchema: z.ZodType<Prisma.MerchantAggregateArgs> = z.object({
  where: MerchantWhereInputSchema.optional(),
  orderBy: z.union([ MerchantOrderByWithRelationInputSchema.array(),MerchantOrderByWithRelationInputSchema ]).optional(),
  cursor: MerchantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MerchantGroupByArgsSchema: z.ZodType<Prisma.MerchantGroupByArgs> = z.object({
  where: MerchantWhereInputSchema.optional(),
  orderBy: z.union([ MerchantOrderByWithAggregationInputSchema.array(),MerchantOrderByWithAggregationInputSchema ]).optional(),
  by: MerchantScalarFieldEnumSchema.array(),
  having: MerchantScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const MerchantFindUniqueArgsSchema: z.ZodType<Omit<Prisma.MerchantFindUniqueArgs, "select" | "include">> = z.object({
  where: MerchantWhereUniqueInputSchema,
}).strict() ;

export const MerchantFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.MerchantFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: MerchantWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMemberFindFirstArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberFindFirstArgs, "select" | "include">> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithRelationInputSchema.array(),OrganizationMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMemberScalarFieldEnumSchema,OrganizationMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMemberFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithRelationInputSchema.array(),OrganizationMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMemberScalarFieldEnumSchema,OrganizationMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMemberFindManyArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberFindManyArgs, "select" | "include">> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithRelationInputSchema.array(),OrganizationMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationMemberScalarFieldEnumSchema,OrganizationMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationMemberAggregateArgsSchema: z.ZodType<Prisma.OrganizationMemberAggregateArgs> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithRelationInputSchema.array(),OrganizationMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationMemberWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationMemberGroupByArgsSchema: z.ZodType<Prisma.OrganizationMemberGroupByArgs> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationMemberOrderByWithAggregationInputSchema.array(),OrganizationMemberOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationMemberScalarFieldEnumSchema.array(),
  having: OrganizationMemberScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationMemberFindUniqueArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberFindUniqueArgs, "select" | "include">> = z.object({
  where: OrganizationMemberWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMemberFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: OrganizationMemberWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindFirstArgsSchema: z.ZodType<Omit<Prisma.OrganizationFindFirstArgs, "select" | "include">> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.OrganizationFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationFindManyArgsSchema: z.ZodType<Omit<Prisma.OrganizationFindManyArgs, "select" | "include">> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizationScalarFieldEnumSchema,OrganizationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrganizationAggregateArgsSchema: z.ZodType<Prisma.OrganizationAggregateArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithRelationInputSchema.array(),OrganizationOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationGroupByArgsSchema: z.ZodType<Prisma.OrganizationGroupByArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
  orderBy: z.union([ OrganizationOrderByWithAggregationInputSchema.array(),OrganizationOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizationScalarFieldEnumSchema.array(),
  having: OrganizationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrganizationFindUniqueArgsSchema: z.ZodType<Omit<Prisma.OrganizationFindUniqueArgs, "select" | "include">> = z.object({
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.OrganizationFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const UserRecordFindFirstArgsSchema: z.ZodType<Omit<Prisma.UserRecordFindFirstArgs, "select" | "include">> = z.object({
  where: UserRecordWhereInputSchema.optional(),
  orderBy: z.union([ UserRecordOrderByWithRelationInputSchema.array(),UserRecordOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRecordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRecordScalarFieldEnumSchema,UserRecordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRecordFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.UserRecordFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: UserRecordWhereInputSchema.optional(),
  orderBy: z.union([ UserRecordOrderByWithRelationInputSchema.array(),UserRecordOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRecordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRecordScalarFieldEnumSchema,UserRecordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRecordFindManyArgsSchema: z.ZodType<Omit<Prisma.UserRecordFindManyArgs, "select" | "include">> = z.object({
  where: UserRecordWhereInputSchema.optional(),
  orderBy: z.union([ UserRecordOrderByWithRelationInputSchema.array(),UserRecordOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRecordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRecordScalarFieldEnumSchema,UserRecordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRecordAggregateArgsSchema: z.ZodType<Prisma.UserRecordAggregateArgs> = z.object({
  where: UserRecordWhereInputSchema.optional(),
  orderBy: z.union([ UserRecordOrderByWithRelationInputSchema.array(),UserRecordOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRecordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserRecordGroupByArgsSchema: z.ZodType<Prisma.UserRecordGroupByArgs> = z.object({
  where: UserRecordWhereInputSchema.optional(),
  orderBy: z.union([ UserRecordOrderByWithAggregationInputSchema.array(),UserRecordOrderByWithAggregationInputSchema ]).optional(),
  by: UserRecordScalarFieldEnumSchema.array(),
  having: UserRecordScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserRecordFindUniqueArgsSchema: z.ZodType<Omit<Prisma.UserRecordFindUniqueArgs, "select" | "include">> = z.object({
  where: UserRecordWhereUniqueInputSchema,
}).strict() ;

export const UserRecordFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.UserRecordFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: UserRecordWhereUniqueInputSchema,
}).strict() ;

export const OverallCollectedAccuracyFindFirstArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyFindFirstArgs, "select" | "include">> = z.object({
  where: OverallCollectedAccuracyWhereInputSchema.optional(),
  orderBy: z.union([ OverallCollectedAccuracyOrderByWithRelationInputSchema.array(),OverallCollectedAccuracyOrderByWithRelationInputSchema ]).optional(),
  cursor: OverallCollectedAccuracyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OverallCollectedAccuracyScalarFieldEnumSchema,OverallCollectedAccuracyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OverallCollectedAccuracyFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: OverallCollectedAccuracyWhereInputSchema.optional(),
  orderBy: z.union([ OverallCollectedAccuracyOrderByWithRelationInputSchema.array(),OverallCollectedAccuracyOrderByWithRelationInputSchema ]).optional(),
  cursor: OverallCollectedAccuracyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OverallCollectedAccuracyScalarFieldEnumSchema,OverallCollectedAccuracyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OverallCollectedAccuracyFindManyArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyFindManyArgs, "select" | "include">> = z.object({
  where: OverallCollectedAccuracyWhereInputSchema.optional(),
  orderBy: z.union([ OverallCollectedAccuracyOrderByWithRelationInputSchema.array(),OverallCollectedAccuracyOrderByWithRelationInputSchema ]).optional(),
  cursor: OverallCollectedAccuracyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OverallCollectedAccuracyScalarFieldEnumSchema,OverallCollectedAccuracyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OverallCollectedAccuracyAggregateArgsSchema: z.ZodType<Prisma.OverallCollectedAccuracyAggregateArgs> = z.object({
  where: OverallCollectedAccuracyWhereInputSchema.optional(),
  orderBy: z.union([ OverallCollectedAccuracyOrderByWithRelationInputSchema.array(),OverallCollectedAccuracyOrderByWithRelationInputSchema ]).optional(),
  cursor: OverallCollectedAccuracyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OverallCollectedAccuracyGroupByArgsSchema: z.ZodType<Prisma.OverallCollectedAccuracyGroupByArgs> = z.object({
  where: OverallCollectedAccuracyWhereInputSchema.optional(),
  orderBy: z.union([ OverallCollectedAccuracyOrderByWithAggregationInputSchema.array(),OverallCollectedAccuracyOrderByWithAggregationInputSchema ]).optional(),
  by: OverallCollectedAccuracyScalarFieldEnumSchema.array(),
  having: OverallCollectedAccuracyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OverallCollectedAccuracyFindUniqueArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyFindUniqueArgs, "select" | "include">> = z.object({
  where: OverallCollectedAccuracyWhereUniqueInputSchema,
}).strict() ;

export const OverallCollectedAccuracyFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: OverallCollectedAccuracyWhereUniqueInputSchema,
}).strict() ;

export const UploadFindFirstArgsSchema: z.ZodType<Omit<Prisma.UploadFindFirstArgs, "select" | "include">> = z.object({
  where: UploadWhereInputSchema.optional(),
  orderBy: z.union([ UploadOrderByWithRelationInputSchema.array(),UploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UploadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UploadScalarFieldEnumSchema,UploadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UploadFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.UploadFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: UploadWhereInputSchema.optional(),
  orderBy: z.union([ UploadOrderByWithRelationInputSchema.array(),UploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UploadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UploadScalarFieldEnumSchema,UploadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UploadFindManyArgsSchema: z.ZodType<Omit<Prisma.UploadFindManyArgs, "select" | "include">> = z.object({
  where: UploadWhereInputSchema.optional(),
  orderBy: z.union([ UploadOrderByWithRelationInputSchema.array(),UploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UploadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UploadScalarFieldEnumSchema,UploadScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UploadAggregateArgsSchema: z.ZodType<Prisma.UploadAggregateArgs> = z.object({
  where: UploadWhereInputSchema.optional(),
  orderBy: z.union([ UploadOrderByWithRelationInputSchema.array(),UploadOrderByWithRelationInputSchema ]).optional(),
  cursor: UploadWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UploadGroupByArgsSchema: z.ZodType<Prisma.UploadGroupByArgs> = z.object({
  where: UploadWhereInputSchema.optional(),
  orderBy: z.union([ UploadOrderByWithAggregationInputSchema.array(),UploadOrderByWithAggregationInputSchema ]).optional(),
  by: UploadScalarFieldEnumSchema.array(),
  having: UploadScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UploadFindUniqueArgsSchema: z.ZodType<Omit<Prisma.UploadFindUniqueArgs, "select" | "include">> = z.object({
  where: UploadWhereUniqueInputSchema,
}).strict() ;

export const UploadFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.UploadFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: UploadWhereUniqueInputSchema,
}).strict() ;

export const oAuthRefreshTokenFindFirstArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenFindFirstArgs, "select" | "include">> = z.object({
  where: oAuthRefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ oAuthRefreshTokenOrderByWithRelationInputSchema.array(),oAuthRefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: oAuthRefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OAuthRefreshTokenScalarFieldEnumSchema,OAuthRefreshTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const oAuthRefreshTokenFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: oAuthRefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ oAuthRefreshTokenOrderByWithRelationInputSchema.array(),oAuthRefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: oAuthRefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OAuthRefreshTokenScalarFieldEnumSchema,OAuthRefreshTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const oAuthRefreshTokenFindManyArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenFindManyArgs, "select" | "include">> = z.object({
  where: oAuthRefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ oAuthRefreshTokenOrderByWithRelationInputSchema.array(),oAuthRefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: oAuthRefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OAuthRefreshTokenScalarFieldEnumSchema,OAuthRefreshTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const oAuthRefreshTokenAggregateArgsSchema: z.ZodType<Prisma.oAuthRefreshTokenAggregateArgs> = z.object({
  where: oAuthRefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ oAuthRefreshTokenOrderByWithRelationInputSchema.array(),oAuthRefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: oAuthRefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const oAuthRefreshTokenGroupByArgsSchema: z.ZodType<Prisma.oAuthRefreshTokenGroupByArgs> = z.object({
  where: oAuthRefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ oAuthRefreshTokenOrderByWithAggregationInputSchema.array(),oAuthRefreshTokenOrderByWithAggregationInputSchema ]).optional(),
  by: OAuthRefreshTokenScalarFieldEnumSchema.array(),
  having: oAuthRefreshTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const oAuthRefreshTokenFindUniqueArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenFindUniqueArgs, "select" | "include">> = z.object({
  where: oAuthRefreshTokenWhereUniqueInputSchema,
}).strict() ;

export const oAuthRefreshTokenFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: oAuthRefreshTokenWhereUniqueInputSchema,
}).strict() ;

export const oAuthConnectionFindFirstArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionFindFirstArgs, "select" | "include">> = z.object({
  where: oAuthConnectionWhereInputSchema.optional(),
  orderBy: z.union([ oAuthConnectionOrderByWithRelationInputSchema.array(),oAuthConnectionOrderByWithRelationInputSchema ]).optional(),
  cursor: oAuthConnectionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OAuthConnectionScalarFieldEnumSchema,OAuthConnectionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const oAuthConnectionFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: oAuthConnectionWhereInputSchema.optional(),
  orderBy: z.union([ oAuthConnectionOrderByWithRelationInputSchema.array(),oAuthConnectionOrderByWithRelationInputSchema ]).optional(),
  cursor: oAuthConnectionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OAuthConnectionScalarFieldEnumSchema,OAuthConnectionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const oAuthConnectionFindManyArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionFindManyArgs, "select" | "include">> = z.object({
  where: oAuthConnectionWhereInputSchema.optional(),
  orderBy: z.union([ oAuthConnectionOrderByWithRelationInputSchema.array(),oAuthConnectionOrderByWithRelationInputSchema ]).optional(),
  cursor: oAuthConnectionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OAuthConnectionScalarFieldEnumSchema,OAuthConnectionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const oAuthConnectionAggregateArgsSchema: z.ZodType<Prisma.oAuthConnectionAggregateArgs> = z.object({
  where: oAuthConnectionWhereInputSchema.optional(),
  orderBy: z.union([ oAuthConnectionOrderByWithRelationInputSchema.array(),oAuthConnectionOrderByWithRelationInputSchema ]).optional(),
  cursor: oAuthConnectionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const oAuthConnectionGroupByArgsSchema: z.ZodType<Prisma.oAuthConnectionGroupByArgs> = z.object({
  where: oAuthConnectionWhereInputSchema.optional(),
  orderBy: z.union([ oAuthConnectionOrderByWithAggregationInputSchema.array(),oAuthConnectionOrderByWithAggregationInputSchema ]).optional(),
  by: OAuthConnectionScalarFieldEnumSchema.array(),
  having: oAuthConnectionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const oAuthConnectionFindUniqueArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionFindUniqueArgs, "select" | "include">> = z.object({
  where: oAuthConnectionWhereUniqueInputSchema,
}).strict() ;

export const oAuthConnectionFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: oAuthConnectionWhereUniqueInputSchema,
}).strict() ;

export const RefreshTokenFindFirstArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenFindFirstArgs, "select" | "include">> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithRelationInputSchema.array(),RefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: RefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RefreshTokenScalarFieldEnumSchema,RefreshTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RefreshTokenFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithRelationInputSchema.array(),RefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: RefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RefreshTokenScalarFieldEnumSchema,RefreshTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RefreshTokenFindManyArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenFindManyArgs, "select" | "include">> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithRelationInputSchema.array(),RefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: RefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RefreshTokenScalarFieldEnumSchema,RefreshTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RefreshTokenAggregateArgsSchema: z.ZodType<Prisma.RefreshTokenAggregateArgs> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithRelationInputSchema.array(),RefreshTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: RefreshTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RefreshTokenGroupByArgsSchema: z.ZodType<Prisma.RefreshTokenGroupByArgs> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
  orderBy: z.union([ RefreshTokenOrderByWithAggregationInputSchema.array(),RefreshTokenOrderByWithAggregationInputSchema ]).optional(),
  by: RefreshTokenScalarFieldEnumSchema.array(),
  having: RefreshTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RefreshTokenFindUniqueArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenFindUniqueArgs, "select" | "include">> = z.object({
  where: RefreshTokenWhereUniqueInputSchema,
}).strict() ;

export const RefreshTokenFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: RefreshTokenWhereUniqueInputSchema,
}).strict() ;

export const TransactionFindFirstArgsSchema: z.ZodType<Omit<Prisma.TransactionFindFirstArgs, "select" | "include">> = z.object({
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithRelationInputSchema.array(),TransactionOrderByWithRelationInputSchema ]).optional(),
  cursor: TransactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransactionScalarFieldEnumSchema,TransactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransactionFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.TransactionFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithRelationInputSchema.array(),TransactionOrderByWithRelationInputSchema ]).optional(),
  cursor: TransactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransactionScalarFieldEnumSchema,TransactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransactionFindManyArgsSchema: z.ZodType<Omit<Prisma.TransactionFindManyArgs, "select" | "include">> = z.object({
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithRelationInputSchema.array(),TransactionOrderByWithRelationInputSchema ]).optional(),
  cursor: TransactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TransactionScalarFieldEnumSchema,TransactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TransactionAggregateArgsSchema: z.ZodType<Prisma.TransactionAggregateArgs> = z.object({
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithRelationInputSchema.array(),TransactionOrderByWithRelationInputSchema ]).optional(),
  cursor: TransactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TransactionGroupByArgsSchema: z.ZodType<Prisma.TransactionGroupByArgs> = z.object({
  where: TransactionWhereInputSchema.optional(),
  orderBy: z.union([ TransactionOrderByWithAggregationInputSchema.array(),TransactionOrderByWithAggregationInputSchema ]).optional(),
  by: TransactionScalarFieldEnumSchema.array(),
  having: TransactionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TransactionFindUniqueArgsSchema: z.ZodType<Omit<Prisma.TransactionFindUniqueArgs, "select" | "include">> = z.object({
  where: TransactionWhereUniqueInputSchema,
}).strict() ;

export const TransactionFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.TransactionFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: TransactionWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Omit<Prisma.UserFindFirstArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.UserFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Omit<Prisma.UserFindManyArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Omit<Prisma.UserFindUniqueArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.UserFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const DentalTherapyCreateArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyCreateArgs, "select" | "include" | "data"> & { data: z.infer<typeof DentalTherapyCreateInputSchema> | z.infer<typeof DentalTherapyUncheckedCreateInputSchema> }> = z.object({
  data: z.union([ DentalTherapyCreateInputSchema,DentalTherapyUncheckedCreateInputSchema ]),
}).strict() ;

export const DentalTherapyUpsertArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyUpsertArgs, "select" | "include" | "create" | "update"> & { create: z.infer<typeof DentalTherapyCreateInputSchema> | z.infer<typeof DentalTherapyUncheckedCreateInputSchema>, update: z.infer<typeof DentalTherapyUpdateInputSchema> | z.infer<typeof DentalTherapyUncheckedUpdateInputSchema> }> = z.object({
  where: DentalTherapyWhereUniqueInputSchema,
  create: z.union([ DentalTherapyCreateInputSchema,DentalTherapyUncheckedCreateInputSchema ]),
  update: z.union([ DentalTherapyUpdateInputSchema,DentalTherapyUncheckedUpdateInputSchema ]),
}).strict() ;

export const DentalTherapyCreateManyArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyCreateManyArgs, "data"> & { data: z.infer<typeof DentalTherapyCreateManyInputSchema> | z.infer<typeof DentalTherapyCreateManyInputSchema>[] }> = z.object({
  data: z.union([ DentalTherapyCreateManyInputSchema,DentalTherapyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DentalTherapyCreateManyAndReturnArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyCreateManyAndReturnArgs, "data"> & { data: z.infer<typeof DentalTherapyCreateManyInputSchema> | z.infer<typeof DentalTherapyCreateManyInputSchema>[] }> = z.object({
  data: z.union([ DentalTherapyCreateManyInputSchema,DentalTherapyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DentalTherapyDeleteArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyDeleteArgs, "select" | "include">> = z.object({
  where: DentalTherapyWhereUniqueInputSchema,
}).strict() ;

export const DentalTherapyUpdateArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyUpdateArgs, "select" | "include" | "data"> & { data: z.infer<typeof DentalTherapyUpdateInputSchema> | z.infer<typeof DentalTherapyUncheckedUpdateInputSchema> }> = z.object({
  data: z.union([ DentalTherapyUpdateInputSchema,DentalTherapyUncheckedUpdateInputSchema ]),
  where: DentalTherapyWhereUniqueInputSchema,
}).strict() ;

export const DentalTherapyUpdateManyArgsSchema: z.ZodType<Omit<Prisma.DentalTherapyUpdateManyArgs, "data"> & { data: z.infer<typeof DentalTherapyUpdateManyMutationInputSchema> | z.infer<typeof DentalTherapyUncheckedUpdateManyInputSchema> }> = z.object({
  data: z.union([ DentalTherapyUpdateManyMutationInputSchema,DentalTherapyUncheckedUpdateManyInputSchema ]),
  where: DentalTherapyWhereInputSchema.optional(),
}).strict() ;

export const DentalTherapyDeleteManyArgsSchema: z.ZodType<Prisma.DentalTherapyDeleteManyArgs> = z.object({
  where: DentalTherapyWhereInputSchema.optional(),
}).strict() ;

export const LocationCreateArgsSchema: z.ZodType<Omit<Prisma.LocationCreateArgs, "select" | "include">> = z.object({
  data: z.union([ LocationCreateInputSchema,LocationUncheckedCreateInputSchema ]),
}).strict() ;

export const LocationUpsertArgsSchema: z.ZodType<Omit<Prisma.LocationUpsertArgs, "select" | "include">> = z.object({
  where: LocationWhereUniqueInputSchema,
  create: z.union([ LocationCreateInputSchema,LocationUncheckedCreateInputSchema ]),
  update: z.union([ LocationUpdateInputSchema,LocationUncheckedUpdateInputSchema ]),
}).strict() ;

export const LocationCreateManyArgsSchema: z.ZodType<Prisma.LocationCreateManyArgs> = z.object({
  data: z.union([ LocationCreateManyInputSchema,LocationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LocationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LocationCreateManyAndReturnArgs> = z.object({
  data: z.union([ LocationCreateManyInputSchema,LocationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LocationDeleteArgsSchema: z.ZodType<Omit<Prisma.LocationDeleteArgs, "select" | "include">> = z.object({
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationUpdateArgsSchema: z.ZodType<Omit<Prisma.LocationUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ LocationUpdateInputSchema,LocationUncheckedUpdateInputSchema ]),
  where: LocationWhereUniqueInputSchema,
}).strict() ;

export const LocationUpdateManyArgsSchema: z.ZodType<Prisma.LocationUpdateManyArgs> = z.object({
  data: z.union([ LocationUpdateManyMutationInputSchema,LocationUncheckedUpdateManyInputSchema ]),
  where: LocationWhereInputSchema.optional(),
}).strict() ;

export const LocationDeleteManyArgsSchema: z.ZodType<Prisma.LocationDeleteManyArgs> = z.object({
  where: LocationWhereInputSchema.optional(),
}).strict() ;

export const MaterialCreateArgsSchema: z.ZodType<Omit<Prisma.MaterialCreateArgs, "select" | "include">> = z.object({
  data: z.union([ MaterialCreateInputSchema,MaterialUncheckedCreateInputSchema ]),
}).strict() ;

export const MaterialUpsertArgsSchema: z.ZodType<Omit<Prisma.MaterialUpsertArgs, "select" | "include">> = z.object({
  where: MaterialWhereUniqueInputSchema,
  create: z.union([ MaterialCreateInputSchema,MaterialUncheckedCreateInputSchema ]),
  update: z.union([ MaterialUpdateInputSchema,MaterialUncheckedUpdateInputSchema ]),
}).strict() ;

export const MaterialCreateManyArgsSchema: z.ZodType<Prisma.MaterialCreateManyArgs> = z.object({
  data: z.union([ MaterialCreateManyInputSchema,MaterialCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MaterialCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MaterialCreateManyAndReturnArgs> = z.object({
  data: z.union([ MaterialCreateManyInputSchema,MaterialCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MaterialDeleteArgsSchema: z.ZodType<Omit<Prisma.MaterialDeleteArgs, "select" | "include">> = z.object({
  where: MaterialWhereUniqueInputSchema,
}).strict() ;

export const MaterialUpdateArgsSchema: z.ZodType<Omit<Prisma.MaterialUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ MaterialUpdateInputSchema,MaterialUncheckedUpdateInputSchema ]),
  where: MaterialWhereUniqueInputSchema,
}).strict() ;

export const MaterialUpdateManyArgsSchema: z.ZodType<Prisma.MaterialUpdateManyArgs> = z.object({
  data: z.union([ MaterialUpdateManyMutationInputSchema,MaterialUncheckedUpdateManyInputSchema ]),
  where: MaterialWhereInputSchema.optional(),
}).strict() ;

export const MaterialDeleteManyArgsSchema: z.ZodType<Prisma.MaterialDeleteManyArgs> = z.object({
  where: MaterialWhereInputSchema.optional(),
}).strict() ;

export const MerchantCreateArgsSchema: z.ZodType<Omit<Prisma.MerchantCreateArgs, "select" | "include">> = z.object({
  data: z.union([ MerchantCreateInputSchema,MerchantUncheckedCreateInputSchema ]),
}).strict() ;

export const MerchantUpsertArgsSchema: z.ZodType<Omit<Prisma.MerchantUpsertArgs, "select" | "include">> = z.object({
  where: MerchantWhereUniqueInputSchema,
  create: z.union([ MerchantCreateInputSchema,MerchantUncheckedCreateInputSchema ]),
  update: z.union([ MerchantUpdateInputSchema,MerchantUncheckedUpdateInputSchema ]),
}).strict() ;

export const MerchantCreateManyArgsSchema: z.ZodType<Prisma.MerchantCreateManyArgs> = z.object({
  data: z.union([ MerchantCreateManyInputSchema,MerchantCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MerchantCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MerchantCreateManyAndReturnArgs> = z.object({
  data: z.union([ MerchantCreateManyInputSchema,MerchantCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const MerchantDeleteArgsSchema: z.ZodType<Omit<Prisma.MerchantDeleteArgs, "select" | "include">> = z.object({
  where: MerchantWhereUniqueInputSchema,
}).strict() ;

export const MerchantUpdateArgsSchema: z.ZodType<Omit<Prisma.MerchantUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ MerchantUpdateInputSchema,MerchantUncheckedUpdateInputSchema ]),
  where: MerchantWhereUniqueInputSchema,
}).strict() ;

export const MerchantUpdateManyArgsSchema: z.ZodType<Prisma.MerchantUpdateManyArgs> = z.object({
  data: z.union([ MerchantUpdateManyMutationInputSchema,MerchantUncheckedUpdateManyInputSchema ]),
  where: MerchantWhereInputSchema.optional(),
}).strict() ;

export const MerchantDeleteManyArgsSchema: z.ZodType<Prisma.MerchantDeleteManyArgs> = z.object({
  where: MerchantWhereInputSchema.optional(),
}).strict() ;

export const OrganizationMemberCreateArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberCreateArgs, "select" | "include">> = z.object({
  data: z.union([ OrganizationMemberCreateInputSchema,OrganizationMemberUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationMemberUpsertArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberUpsertArgs, "select" | "include">> = z.object({
  where: OrganizationMemberWhereUniqueInputSchema,
  create: z.union([ OrganizationMemberCreateInputSchema,OrganizationMemberUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationMemberUpdateInputSchema,OrganizationMemberUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationMemberCreateManyArgsSchema: z.ZodType<Prisma.OrganizationMemberCreateManyArgs> = z.object({
  data: z.union([ OrganizationMemberCreateManyInputSchema,OrganizationMemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationMemberCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationMemberCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationMemberCreateManyInputSchema,OrganizationMemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationMemberDeleteArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberDeleteArgs, "select" | "include">> = z.object({
  where: OrganizationMemberWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMemberUpdateArgsSchema: z.ZodType<Omit<Prisma.OrganizationMemberUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ OrganizationMemberUpdateInputSchema,OrganizationMemberUncheckedUpdateInputSchema ]),
  where: OrganizationMemberWhereUniqueInputSchema,
}).strict() ;

export const OrganizationMemberUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationMemberUpdateManyArgs> = z.object({
  data: z.union([ OrganizationMemberUpdateManyMutationInputSchema,OrganizationMemberUncheckedUpdateManyInputSchema ]),
  where: OrganizationMemberWhereInputSchema.optional(),
}).strict() ;

export const OrganizationMemberDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationMemberDeleteManyArgs> = z.object({
  where: OrganizationMemberWhereInputSchema.optional(),
}).strict() ;

export const OrganizationCreateArgsSchema: z.ZodType<Omit<Prisma.OrganizationCreateArgs, "select" | "include">> = z.object({
  data: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
}).strict() ;

export const OrganizationUpsertArgsSchema: z.ZodType<Omit<Prisma.OrganizationUpsertArgs, "select" | "include">> = z.object({
  where: OrganizationWhereUniqueInputSchema,
  create: z.union([ OrganizationCreateInputSchema,OrganizationUncheckedCreateInputSchema ]),
  update: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrganizationCreateManyArgsSchema: z.ZodType<Prisma.OrganizationCreateManyArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizationCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizationCreateManyInputSchema,OrganizationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrganizationDeleteArgsSchema: z.ZodType<Omit<Prisma.OrganizationDeleteArgs, "select" | "include">> = z.object({
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateArgsSchema: z.ZodType<Omit<Prisma.OrganizationUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ OrganizationUpdateInputSchema,OrganizationUncheckedUpdateInputSchema ]),
  where: OrganizationWhereUniqueInputSchema,
}).strict() ;

export const OrganizationUpdateManyArgsSchema: z.ZodType<Prisma.OrganizationUpdateManyArgs> = z.object({
  data: z.union([ OrganizationUpdateManyMutationInputSchema,OrganizationUncheckedUpdateManyInputSchema ]),
  where: OrganizationWhereInputSchema.optional(),
}).strict() ;

export const OrganizationDeleteManyArgsSchema: z.ZodType<Prisma.OrganizationDeleteManyArgs> = z.object({
  where: OrganizationWhereInputSchema.optional(),
}).strict() ;

export const UserRecordCreateArgsSchema: z.ZodType<Omit<Prisma.UserRecordCreateArgs, "select" | "include">> = z.object({
  data: z.union([ UserRecordCreateInputSchema,UserRecordUncheckedCreateInputSchema ]),
}).strict() ;

export const UserRecordUpsertArgsSchema: z.ZodType<Omit<Prisma.UserRecordUpsertArgs, "select" | "include">> = z.object({
  where: UserRecordWhereUniqueInputSchema,
  create: z.union([ UserRecordCreateInputSchema,UserRecordUncheckedCreateInputSchema ]),
  update: z.union([ UserRecordUpdateInputSchema,UserRecordUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserRecordCreateManyArgsSchema: z.ZodType<Prisma.UserRecordCreateManyArgs> = z.object({
  data: z.union([ UserRecordCreateManyInputSchema,UserRecordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserRecordCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserRecordCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserRecordCreateManyInputSchema,UserRecordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserRecordDeleteArgsSchema: z.ZodType<Omit<Prisma.UserRecordDeleteArgs, "select" | "include">> = z.object({
  where: UserRecordWhereUniqueInputSchema,
}).strict() ;

export const UserRecordUpdateArgsSchema: z.ZodType<Omit<Prisma.UserRecordUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ UserRecordUpdateInputSchema,UserRecordUncheckedUpdateInputSchema ]),
  where: UserRecordWhereUniqueInputSchema,
}).strict() ;

export const UserRecordUpdateManyArgsSchema: z.ZodType<Prisma.UserRecordUpdateManyArgs> = z.object({
  data: z.union([ UserRecordUpdateManyMutationInputSchema,UserRecordUncheckedUpdateManyInputSchema ]),
  where: UserRecordWhereInputSchema.optional(),
}).strict() ;

export const UserRecordDeleteManyArgsSchema: z.ZodType<Prisma.UserRecordDeleteManyArgs> = z.object({
  where: UserRecordWhereInputSchema.optional(),
}).strict() ;

export const OverallCollectedAccuracyCreateArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyCreateArgs, "select" | "include">> = z.object({
  data: z.union([ OverallCollectedAccuracyCreateInputSchema,OverallCollectedAccuracyUncheckedCreateInputSchema ]),
}).strict() ;

export const OverallCollectedAccuracyUpsertArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyUpsertArgs, "select" | "include">> = z.object({
  where: OverallCollectedAccuracyWhereUniqueInputSchema,
  create: z.union([ OverallCollectedAccuracyCreateInputSchema,OverallCollectedAccuracyUncheckedCreateInputSchema ]),
  update: z.union([ OverallCollectedAccuracyUpdateInputSchema,OverallCollectedAccuracyUncheckedUpdateInputSchema ]),
}).strict() ;

export const OverallCollectedAccuracyCreateManyArgsSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateManyArgs> = z.object({
  data: z.union([ OverallCollectedAccuracyCreateManyInputSchema,OverallCollectedAccuracyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OverallCollectedAccuracyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OverallCollectedAccuracyCreateManyAndReturnArgs> = z.object({
  data: z.union([ OverallCollectedAccuracyCreateManyInputSchema,OverallCollectedAccuracyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OverallCollectedAccuracyDeleteArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyDeleteArgs, "select" | "include">> = z.object({
  where: OverallCollectedAccuracyWhereUniqueInputSchema,
}).strict() ;

export const OverallCollectedAccuracyUpdateArgsSchema: z.ZodType<Omit<Prisma.OverallCollectedAccuracyUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ OverallCollectedAccuracyUpdateInputSchema,OverallCollectedAccuracyUncheckedUpdateInputSchema ]),
  where: OverallCollectedAccuracyWhereUniqueInputSchema,
}).strict() ;

export const OverallCollectedAccuracyUpdateManyArgsSchema: z.ZodType<Prisma.OverallCollectedAccuracyUpdateManyArgs> = z.object({
  data: z.union([ OverallCollectedAccuracyUpdateManyMutationInputSchema,OverallCollectedAccuracyUncheckedUpdateManyInputSchema ]),
  where: OverallCollectedAccuracyWhereInputSchema.optional(),
}).strict() ;

export const OverallCollectedAccuracyDeleteManyArgsSchema: z.ZodType<Prisma.OverallCollectedAccuracyDeleteManyArgs> = z.object({
  where: OverallCollectedAccuracyWhereInputSchema.optional(),
}).strict() ;

export const UploadCreateArgsSchema: z.ZodType<Omit<Prisma.UploadCreateArgs, "select" | "include">> = z.object({
  data: z.union([ UploadCreateInputSchema,UploadUncheckedCreateInputSchema ]),
}).strict() ;

export const UploadUpsertArgsSchema: z.ZodType<Omit<Prisma.UploadUpsertArgs, "select" | "include">> = z.object({
  where: UploadWhereUniqueInputSchema,
  create: z.union([ UploadCreateInputSchema,UploadUncheckedCreateInputSchema ]),
  update: z.union([ UploadUpdateInputSchema,UploadUncheckedUpdateInputSchema ]),
}).strict() ;

export const UploadCreateManyArgsSchema: z.ZodType<Prisma.UploadCreateManyArgs> = z.object({
  data: z.union([ UploadCreateManyInputSchema,UploadCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UploadCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UploadCreateManyAndReturnArgs> = z.object({
  data: z.union([ UploadCreateManyInputSchema,UploadCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UploadDeleteArgsSchema: z.ZodType<Omit<Prisma.UploadDeleteArgs, "select" | "include">> = z.object({
  where: UploadWhereUniqueInputSchema,
}).strict() ;

export const UploadUpdateArgsSchema: z.ZodType<Omit<Prisma.UploadUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ UploadUpdateInputSchema,UploadUncheckedUpdateInputSchema ]),
  where: UploadWhereUniqueInputSchema,
}).strict() ;

export const UploadUpdateManyArgsSchema: z.ZodType<Prisma.UploadUpdateManyArgs> = z.object({
  data: z.union([ UploadUpdateManyMutationInputSchema,UploadUncheckedUpdateManyInputSchema ]),
  where: UploadWhereInputSchema.optional(),
}).strict() ;

export const UploadDeleteManyArgsSchema: z.ZodType<Prisma.UploadDeleteManyArgs> = z.object({
  where: UploadWhereInputSchema.optional(),
}).strict() ;

export const oAuthRefreshTokenCreateArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenCreateArgs, "select" | "include">> = z.object({
  data: z.union([ oAuthRefreshTokenCreateInputSchema,oAuthRefreshTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const oAuthRefreshTokenUpsertArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenUpsertArgs, "select" | "include">> = z.object({
  where: oAuthRefreshTokenWhereUniqueInputSchema,
  create: z.union([ oAuthRefreshTokenCreateInputSchema,oAuthRefreshTokenUncheckedCreateInputSchema ]),
  update: z.union([ oAuthRefreshTokenUpdateInputSchema,oAuthRefreshTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const oAuthRefreshTokenCreateManyArgsSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateManyArgs> = z.object({
  data: z.union([ oAuthRefreshTokenCreateManyInputSchema,oAuthRefreshTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const oAuthRefreshTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.oAuthRefreshTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ oAuthRefreshTokenCreateManyInputSchema,oAuthRefreshTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const oAuthRefreshTokenDeleteArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenDeleteArgs, "select" | "include">> = z.object({
  where: oAuthRefreshTokenWhereUniqueInputSchema,
}).strict() ;

export const oAuthRefreshTokenUpdateArgsSchema: z.ZodType<Omit<Prisma.oAuthRefreshTokenUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ oAuthRefreshTokenUpdateInputSchema,oAuthRefreshTokenUncheckedUpdateInputSchema ]),
  where: oAuthRefreshTokenWhereUniqueInputSchema,
}).strict() ;

export const oAuthRefreshTokenUpdateManyArgsSchema: z.ZodType<Prisma.oAuthRefreshTokenUpdateManyArgs> = z.object({
  data: z.union([ oAuthRefreshTokenUpdateManyMutationInputSchema,oAuthRefreshTokenUncheckedUpdateManyInputSchema ]),
  where: oAuthRefreshTokenWhereInputSchema.optional(),
}).strict() ;

export const oAuthRefreshTokenDeleteManyArgsSchema: z.ZodType<Prisma.oAuthRefreshTokenDeleteManyArgs> = z.object({
  where: oAuthRefreshTokenWhereInputSchema.optional(),
}).strict() ;

export const oAuthConnectionCreateArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionCreateArgs, "select" | "include">> = z.object({
  data: z.union([ oAuthConnectionCreateInputSchema,oAuthConnectionUncheckedCreateInputSchema ]),
}).strict() ;

export const oAuthConnectionUpsertArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionUpsertArgs, "select" | "include">> = z.object({
  where: oAuthConnectionWhereUniqueInputSchema,
  create: z.union([ oAuthConnectionCreateInputSchema,oAuthConnectionUncheckedCreateInputSchema ]),
  update: z.union([ oAuthConnectionUpdateInputSchema,oAuthConnectionUncheckedUpdateInputSchema ]),
}).strict() ;

export const oAuthConnectionCreateManyArgsSchema: z.ZodType<Prisma.oAuthConnectionCreateManyArgs> = z.object({
  data: z.union([ oAuthConnectionCreateManyInputSchema,oAuthConnectionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const oAuthConnectionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.oAuthConnectionCreateManyAndReturnArgs> = z.object({
  data: z.union([ oAuthConnectionCreateManyInputSchema,oAuthConnectionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const oAuthConnectionDeleteArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionDeleteArgs, "select" | "include">> = z.object({
  where: oAuthConnectionWhereUniqueInputSchema,
}).strict() ;

export const oAuthConnectionUpdateArgsSchema: z.ZodType<Omit<Prisma.oAuthConnectionUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ oAuthConnectionUpdateInputSchema,oAuthConnectionUncheckedUpdateInputSchema ]),
  where: oAuthConnectionWhereUniqueInputSchema,
}).strict() ;

export const oAuthConnectionUpdateManyArgsSchema: z.ZodType<Prisma.oAuthConnectionUpdateManyArgs> = z.object({
  data: z.union([ oAuthConnectionUpdateManyMutationInputSchema,oAuthConnectionUncheckedUpdateManyInputSchema ]),
  where: oAuthConnectionWhereInputSchema.optional(),
}).strict() ;

export const oAuthConnectionDeleteManyArgsSchema: z.ZodType<Prisma.oAuthConnectionDeleteManyArgs> = z.object({
  where: oAuthConnectionWhereInputSchema.optional(),
}).strict() ;

export const RefreshTokenCreateArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenCreateArgs, "select" | "include">> = z.object({
  data: z.union([ RefreshTokenCreateInputSchema,RefreshTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const RefreshTokenUpsertArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenUpsertArgs, "select" | "include">> = z.object({
  where: RefreshTokenWhereUniqueInputSchema,
  create: z.union([ RefreshTokenCreateInputSchema,RefreshTokenUncheckedCreateInputSchema ]),
  update: z.union([ RefreshTokenUpdateInputSchema,RefreshTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const RefreshTokenCreateManyArgsSchema: z.ZodType<Prisma.RefreshTokenCreateManyArgs> = z.object({
  data: z.union([ RefreshTokenCreateManyInputSchema,RefreshTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RefreshTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RefreshTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ RefreshTokenCreateManyInputSchema,RefreshTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RefreshTokenDeleteArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenDeleteArgs, "select" | "include">> = z.object({
  where: RefreshTokenWhereUniqueInputSchema,
}).strict() ;

export const RefreshTokenUpdateArgsSchema: z.ZodType<Omit<Prisma.RefreshTokenUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ RefreshTokenUpdateInputSchema,RefreshTokenUncheckedUpdateInputSchema ]),
  where: RefreshTokenWhereUniqueInputSchema,
}).strict() ;

export const RefreshTokenUpdateManyArgsSchema: z.ZodType<Prisma.RefreshTokenUpdateManyArgs> = z.object({
  data: z.union([ RefreshTokenUpdateManyMutationInputSchema,RefreshTokenUncheckedUpdateManyInputSchema ]),
  where: RefreshTokenWhereInputSchema.optional(),
}).strict() ;

export const RefreshTokenDeleteManyArgsSchema: z.ZodType<Prisma.RefreshTokenDeleteManyArgs> = z.object({
  where: RefreshTokenWhereInputSchema.optional(),
}).strict() ;

export const TransactionCreateArgsSchema: z.ZodType<Omit<Prisma.TransactionCreateArgs, "select" | "include">> = z.object({
  data: z.union([ TransactionCreateInputSchema,TransactionUncheckedCreateInputSchema ]),
}).strict() ;

export const TransactionUpsertArgsSchema: z.ZodType<Omit<Prisma.TransactionUpsertArgs, "select" | "include">> = z.object({
  where: TransactionWhereUniqueInputSchema,
  create: z.union([ TransactionCreateInputSchema,TransactionUncheckedCreateInputSchema ]),
  update: z.union([ TransactionUpdateInputSchema,TransactionUncheckedUpdateInputSchema ]),
}).strict() ;

export const TransactionCreateManyArgsSchema: z.ZodType<Prisma.TransactionCreateManyArgs> = z.object({
  data: z.union([ TransactionCreateManyInputSchema,TransactionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TransactionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TransactionCreateManyAndReturnArgs> = z.object({
  data: z.union([ TransactionCreateManyInputSchema,TransactionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TransactionDeleteArgsSchema: z.ZodType<Omit<Prisma.TransactionDeleteArgs, "select" | "include">> = z.object({
  where: TransactionWhereUniqueInputSchema,
}).strict() ;

export const TransactionUpdateArgsSchema: z.ZodType<Omit<Prisma.TransactionUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ TransactionUpdateInputSchema,TransactionUncheckedUpdateInputSchema ]),
  where: TransactionWhereUniqueInputSchema,
}).strict() ;

export const TransactionUpdateManyArgsSchema: z.ZodType<Prisma.TransactionUpdateManyArgs> = z.object({
  data: z.union([ TransactionUpdateManyMutationInputSchema,TransactionUncheckedUpdateManyInputSchema ]),
  where: TransactionWhereInputSchema.optional(),
}).strict() ;

export const TransactionDeleteManyArgsSchema: z.ZodType<Prisma.TransactionDeleteManyArgs> = z.object({
  where: TransactionWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Omit<Prisma.UserCreateArgs, "select" | "include">> = z.object({
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Omit<Prisma.UserUpsertArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Omit<Prisma.UserDeleteArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Omit<Prisma.UserUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;