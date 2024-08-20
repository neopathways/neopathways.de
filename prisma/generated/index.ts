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

export const UserScalarFieldEnumSchema = z.enum(['uid','email','firstname','lastname','password','created','updated']);

export const OrganizationMemberScalarFieldEnumSchema = z.enum(['uid','useruid','orguid','created','role']);

export const RefreshTokenScalarFieldEnumSchema = z.enum(['uid','token','useruid','created','validUntil','ip','agent']);

export const OrganizationScalarFieldEnumSchema = z.enum(['uid','name','ownerId','created','updated','description','redirecturl']);

export const UserRecordScalarFieldEnumSchema = z.enum(['uid','created','updated','outdated','category','tags','data','accuracy','useruid','orguid']);

export const OverallCollectedAccuracyScalarFieldEnumSchema = z.enum(['uid','useruid','orguid','accuracy','created']);

export const UploadScalarFieldEnumSchema = z.enum(['uid','filename','description','mimetype','encoding','useruid','orguid','created']);

export const OAuthRefreshTokenScalarFieldEnumSchema = z.enum(['uid','token','useruid','orguid','created','validUntil']);

export const OAuthConnectionScalarFieldEnumSchema = z.enum(['uid','useruid','orguid','created','updated','scopes']);

export const IPGeocodeScalarFieldEnumSchema = z.enum(['uid','ip','continent_code','continent_name','country_code','country_name','subdivision_code','subdivision_name','city_name','latitude','longitude','postal_code','timezone','accuracy_radius']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

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

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

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

/////////////////////////////////////////
// IP GEOCODE SCHEMA
/////////////////////////////////////////

export const IPGeocodeSchema = z.object({
  uid: z.string().cuid(),
  ip: z.string(),
  continent_code: z.string(),
  continent_name: z.string(),
  country_code: z.string(),
  country_name: z.string(),
  subdivision_code: z.string(),
  subdivision_name: z.string(),
  city_name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  postal_code: z.string(),
  timezone: z.string(),
  accuracy_radius: z.number().int(),
})

export type IPGeocode = z.infer<typeof IPGeocodeSchema>
